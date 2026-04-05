import { CheckCircle2, Circle } from "lucide-react";
import { STATUS_STEPS } from "../../../utils/constants";

const DeliveryProgressBar = ({ status }) => {
    const steps = [...STATUS_STEPS];
    if (status === "returned") {
        steps.push({ key: "returned", label: "Returned" });
    }
    const currentIdx = steps.findIndex((s) => s.key === status);
    return (
        <div className="py-4">
            <div className="flex items-start">
                {steps.map((step, i) => {
                    const done = i <= currentIdx;
                    const isLast = i === steps.length - 1;
                    return (
                        <div key={step.key} className="flex-1 flex flex-col items-center relative">
                            {/* Connector line */}
                            {!isLast && (
                                <div
                                    className={`absolute top-3 left-1/2 w-full h-0.5 ${done && i < currentIdx ? "bg-orange" : "bg-gray-200"}`}
                                />
                            )}
                            {/* Circle */}
                            <div
                                className={`size-6  rounded-full z-10 flex items-center justify-center border-2 ${
                                    done
                                        ? "bg-orange border-orange"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                {done ? (
                                    <CheckCircle2
                                        size={50}
                                        className="text-white"
                                        strokeWidth={2.5}
                                    />
                                ) : (
                                    <Circle size={50} className="text-gray-300" />
                                )}
                            </div>
                            <p
                                className={`text-[10px] mt-1.5 text-center font-medium leading-tight ${
                                    done ? "text-orange" : "text-gray-400"
                                }`}
                            >
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeliveryProgressBar;