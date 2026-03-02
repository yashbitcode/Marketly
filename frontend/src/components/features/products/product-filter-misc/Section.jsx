const Section = ({ title, children }) => (
    <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {title}
        </span>
        {children}
    </div>
);

export default Section;