import { Button } from "../../common";

const Detail = ({ label, value, full }) => (
    <div className={full ? "col-span-2" : ""}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value || "-"}</p>
    </div>
);

const VendorApplicationModal = ({ application, onClose }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex flex-col items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight pb-4 mb-6 border-b border-gray-100">Vendor Application Details</h3>

                <div className="grid grid-cols-2 max-[500px]:grid-cols-1 gap-6">
                    <Detail label="Store Name" value={application.storeName} />
                    <Detail label="Vendor Type" value={application.vendorType} />
                    <Detail label="Full Name" value={application.fullname} />
                    <Detail label="Phone Number" value={application.phoneNumber} />
                    <Detail label="Status" value={application.applicationStatus} />
                </div>

                <div className="mt-4">
                    <Detail label="Description" value={application.description || "-"} full />
                </div>
                {application.remarks && (
                    <div className="mt-4">
                        <Detail label="Admin Remarks" value={application.remarks} full />
                    </div>
                )}

                <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium border-none"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VendorApplicationModal;
