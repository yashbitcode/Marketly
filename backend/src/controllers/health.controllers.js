const healthCheck = (req, res) => {
    res.json({
        success: true,
        message: "All good",
    });
};

export { healthCheck };
