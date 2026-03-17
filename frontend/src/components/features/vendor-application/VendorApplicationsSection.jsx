import { useState } from "react";
import { Button } from "../../common";
import VendorApplicationModal from "./VendorApplicationModal";
import { getFormatedStr } from "../../../utils/helpers";

const getStatusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-600";
    if (status === "rejected") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
};

const VendorApplicationsSection = ({ applications }) => {
    const [selectedApp, setSelectedApp] = useState(null);

    return (
        <div className="space-y-4">
            {/* Scroll Container */}
            <div className="max-h-80 overflow-y-scroll scrollbar-thin-custom space-y-3 p-1 scrollbar-thin-custom">
                {applications.map((app) => (
                    <div
                        key={app._id}
                        className="border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-gray-50/80 p-5 flex items-center justify-between transition max-[500px]:flex-col max-[500px]:items-start gap-4"
                    >
                        {/* Left Side */}
                        <div className="flex items-start max-[500px]:flex-col gap-2">
                            <h3 className="font-medium max-[500px]:text-sm">{app.storeName}</h3>

                            <span
                                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                                    app.applicationStatus,
                                )}`}
                            >
                                {getFormatedStr(app.applicationStatus)}
                            </span>
                        </div>

                        {/* Right Side */}
                        <Button
                            onClick={() => setSelectedApp(app)}
                            className="text-sm px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            View
                        </Button>
                    </div>
                ))}
            </div>

            {selectedApp && (
                <VendorApplicationModal
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                />
            )}
        </div>
    );
};

export default VendorApplicationsSection;
