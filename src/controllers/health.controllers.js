const healthCheck = (req, res) => {
    ap();
    res.json({
        success: true,
        message: "All good",
    });
};

const ap = () => {
    throw new Error();
}

module.exports = {
    healthCheck,
};
