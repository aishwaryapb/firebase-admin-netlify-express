const isAuthenticated = (req, res, next) => {
    // get idToken from req headers and validate using admin.auth()
    next();
}

module.exports = isAuthenticated;