import { useState } from "react";
import { Input } from ".";

const Dropdown = ({ ref, setVal, name, onFocus, onBlur, dropdownList, ...props }) => {
    const [showDrop, setShowDrop] = useState(false);

    return (
        <div className="w-full relative">
            <Input
                ref={ref}
                name={name}
                onFocus={(e) => {
                    setShowDrop(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setShowDrop(false);
                    onBlur?.(e);
                }}
                {...props}
            />
            {showDrop && (
                <ul className="flex flex-col gap-2 max-h-50 p-3 bg-neutral-100 shadow-base scrollbar-thin-custom absolute overflow-scroll top-23 w-full rounded-base">
                    {dropdownList.map((el) => (
                        <li
                            className="hover:bg-neutral-200 px-3 rounded-base cursor-pointer py-1"
                            onMouseDown={() => {
                                setVal(name, el, {
                                    shouldTouch: true,
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                                setShowDrop(false);
                            }}
                            key={el}
                        >
                            {el}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
