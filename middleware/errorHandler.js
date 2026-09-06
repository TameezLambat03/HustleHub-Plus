const errorHandler = (err, req, res, next) => {
    // Log the actual error on the server for debugging
    console.error(err);

    // Send a safe error message to the client
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred"
    });
};

module.exports = errorHandler;