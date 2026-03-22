import { useState } from "react";
import CompanyTab from "./tabs/CompanyTab";
import ApiKeysTab from "./tabs/ApiKeysTab";
import AccountTab from "./tabs/AccountTab";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("company");

    const tabClass = (tab) =>
        `px-6 py-4 font-medium border-b-2 transition ${activeTab === tab
            ? "text-blue-600 border-blue-600"
            : "text-slate-600 border-transparent hover:text-slate-900"
        }`;

    return (
        <div className="max-w-5xl bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 flex">
                <button className={tabClass("company")} onClick={() => setActiveTab("company")}>
                    Company Profile
                </button>
                <button className={tabClass("api")} onClick={() => setActiveTab("api")}>
                    API Keys
                </button>
                <button className={tabClass("account")} onClick={() => setActiveTab("account")}>
                    Account
                </button>
            </div>

            <div className="p-8">
                {activeTab === "company" && <CompanyTab />}
                {activeTab === "api" && <ApiKeysTab />}
                {activeTab === "account" && <AccountTab />}
            </div>
        </div>

    );
}
