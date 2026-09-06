const errorHandler = (err, req, res, next) => {
    // Malformed JSON sent by the client
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format"
        });
    }

    // Log unexpected errors on the server
    console.error(err);

    // Safe response for unexpected server errors
    res.status(500).json({
        success: false,
        message: "An unexpected error occurred"
    });
};

module.exports = errorHandler;