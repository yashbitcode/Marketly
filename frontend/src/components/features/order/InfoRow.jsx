const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{value}</span>
    </div>
);

export default InfoRow;