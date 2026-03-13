import { Info } from "lucide-react";
import { getFormatedStr } from "../../../../utils/helpers";

const TabVendor = ({ fullname, storeName, vendorType }) => {
    return (
        <div>
            <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Info size={17} className="text-amber-400" /> Vendor Details
            </h3>
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-base">
                <div className={`flex items-center px-5 py-2 `}>
                    <span className="w-36 sm:w-44 text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                        Vendor Name
                    </span>
                    <span className="text-sm text-slate-900 font-semibold">{getFormatedStr(fullname)}</span>
                </div>
                <div className={`flex items-center px-5 py-2`}>
                    <span className="w-36 sm:w-44 text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                        Store Name
                    </span>
                    <span className="text-sm text-slate-900 font-semibold">{getFormatedStr(storeName)}</span>
                </div>
                <div className={`flex items-center px-5 py-2`}>
                    <span className="w-36 sm:w-44 text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">
                        Vendor Type
                    </span>
                    <span className="text-sm text-slate-900 font-semibold">{getFormatedStr(vendorType)}</span>
                </div>
            </div>
        </div>
    );
};

export default TabVendor;
