export const dashboardStats = [
  { label: "Total Feedback", value: "2,847", trend: "+12.5%", tone: "blue" },
  { label: "Feedback Today", value: "47", trend: "+5", tone: "violet" },
  { label: "Average Rating", value: "4.8", trend: "+0.2", tone: "amber" },
  { label: "Response Rate", value: "89%", trend: "+3.1%", tone: "green" },
];

export const dashboardToneMap = {
  blue: { badge: "bg-blue-100 text-blue-700", card: "bg-blue-100 text-blue-600" },
  violet: { badge: "bg-violet-100 text-violet-700", card: "bg-violet-100 text-violet-600" },
  amber: { badge: "bg-amber-100 text-amber-700", card: "bg-amber-100 text-amber-600" },
  green: { badge: "bg-emerald-100 text-emerald-700", card: "bg-emerald-100 text-emerald-600" },
};
