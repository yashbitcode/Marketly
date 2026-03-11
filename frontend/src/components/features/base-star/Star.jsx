const Star = ({ fill = 0, size = 20, color = "#FFD700", bg = "#e0e0e0" }) => {
    const uid = `clip_${size}_${Math.round(fill)}`;

    const path = `
    M 50,5
    C 50,5 53,5 54.5,8
    L 62,28
    C 62.5,30 64,31 66,31.5
    L 88,35
    C 91,35.5 93,38 91.5,40.5
    L 75,56
    C 73.5,57.5 73,60 73.5,62
    L 78,85
    C 78.5,88 76.5,91 73.5,89.5
    L 52,78
    C 50.5,77 49.5,77 48,78
    L 26.5,89.5
    C 23.5,91 21.5,88 22,85
    L 26.5,62
    C 27,60 26.5,57.5 25,56
    L 8.5,40.5
    C 7,38 9,35.5 12,35
    L 34,31.5
    C 36,31 37.5,30 38,28
    L 45.5,8
    C 47,5 50,5 50,5
    Z
  `;

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id={uid}>
                    <rect x="0" y="0" width={fill} height="100" />
                </clipPath>
            </defs>
            <path d={path} fill={bg} />
            <path d={path} fill={color} clipPath={`url(#${uid})`} />
        </svg>
    );
};

export default Star;
