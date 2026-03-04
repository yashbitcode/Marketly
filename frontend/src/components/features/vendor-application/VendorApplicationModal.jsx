import { Button } from "../../common";

const Detail = ({ label, value, full }) => (
    <div className={full ? "col-span-2" : ""}>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value || "-"}</p>
    </div>
);

const VendorApplicationModal = ({ application, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-base p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-6">Vendor Application Details</h3>

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

                <div className="flex justify-end mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="px-4 py-2 rounded-base"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VendorApplicationModal;
