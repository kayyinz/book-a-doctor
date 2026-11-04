const errorHandler =  (err, req, res, next) =>  {
    console.log(err);

    const status = err.status || 500;
    res.status(status).send({
        message:status === 500 ? "Server error" : err.message,
        success: false,
    });
};

module.exports = errorHandler;