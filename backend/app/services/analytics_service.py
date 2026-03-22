from datetime import datetime, timedelta

from sqlalchemy.orm import Session  # type: ignore

from app.models.feedback import Feedback


def _parse_feedback(feedback: Feedback):
    metadata = {}
    body = feedback.message or ""
    if body.startswith("[") and "]" in body:
        first_line, _, remainder = body.partition("\n")
        meta_part = first_line[1:first_line.find("]")]
        for token in meta_part.split("|"):
            chunk = token.strip()
            if ":" not in chunk:
                continue
            key, value = chunk.split(":", 1)
            metadata[key.strip().lower()] = value.strip()
        body = remainder
    return {
        "category": metadata.get("category", "General"),
        "rating": feedback.rating,
        "archived": metadata.get("archived", "false").lower() == "true",
        "reply_text": metadata.get("reply"),
        "created_at": feedback.created_at,
    }


def get_analytics_summary(db: Session, company_id: int, range_key: str = "30d"):
    rows = (
        db.query(Feedback)
        .filter(Feedback.company_id == company_id)
        .order_by(Feedback.created_at.desc())
        .all()
    )
    parsed_rows = [_parse_feedback(row) for row in rows]

    now = datetime.utcnow()
    if range_key == "7d":
        range_days = 7
    elif range_key == "30d":
        range_days = 30
    else:
        range_days = None

    filtered = []
    for item in parsed_rows:
        if range_days is None:
            filtered.append(item)
            continue
        created = item["created_at"]
        diff = (now - created).total_seconds() / (60 * 60 * 24)
        if diff <= range_days:
            filtered.append(item)

    total = len(filtered)
    archived = len([item for item in filtered if item["archived"]])
    replied = len([item for item in filtered if item["reply_text"]])
    rated = [item for item in filtered if isinstance(item["rating"], int)]
    avg_rating = round(sum(item["rating"] for item in rated) / len(rated), 1) if rated else 0.0
    response_rate = round((replied / total) * 100) if total else 0

    category_counts = {}
    for item in filtered:
        key = item["category"] or "General"
        category_counts[key] = category_counts.get(key, 0) + 1
    categories = [
        {"category": category, "count": count}
        for category, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    ratings = []
    for star in [5, 4, 3, 2, 1]:
        ratings.append({
            "star": star,
            "count": len([item for item in filtered if item["rating"] == star]),
        })

    trend_days = 7 if range_key == "7d" else 30
    trend_map = {}
    for i in range(trend_days - 1, -1, -1):
        day = now - timedelta(days=i)
        key = day.date().isoformat()
        trend_map[key] = 0
    for item in filtered:
        day_key = item["created_at"].date().isoformat()
        if day_key in trend_map:
            trend_map[day_key] += 1
    trend = [{"date": day, "count": count} for day, count in trend_map.items()]

    return {
        "total": total,
        "archived": archived,
        "avg_rating": avg_rating,
        "response_rate": response_rate,
        "categories": categories,
        "ratings": ratings,
        "trend": trend,
    }
