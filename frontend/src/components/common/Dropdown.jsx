import { useMemo, useState } from "react";
import { Input } from ".";

const Dropdown = ({ ref, setVal, name, watch, onFocus, onBlur, dropdownList, ...props }) => {
    const [showDrop, setShowDrop] = useState(false);
    const value = watch?.(name) || "";

    const filteredList = useMemo(
        () =>
            dropdownList.filter(
                (el) =>
                    el.toLowerCase() !== value && el.toLowerCase().includes(value.toLowerCase()),
            ),
        [value, dropdownList],
    );

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
            {showDrop && filteredList?.length !== 0 && (
                <ul className="flex flex-col gap-2 max-h-50  bg-neutral-100 shadow-base scrollbar-thin-custom absolute overflow-y-auto overflow-x-hidden  top-23 w-full rounded-base p-3">
                    {filteredList.map((el) => (
                        <li
                            className="hover:bg-neutral-200 px-3 py-1 rounded-base cursor-pointer"
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
