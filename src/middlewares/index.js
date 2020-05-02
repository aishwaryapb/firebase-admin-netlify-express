const admin = require('firebase-admin');

const isAuthenticated = (req, res, next) => {
    const idToken = req.headers.authorization;
    if (!idToken) {
        return res.status(401).send("Unauthorized");
    }

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            const { email } = decodedToken;
            let { user } = req.query.user
                ? req.query
                : req.body.user ? req.body : {};
            if (user && user !== email) return res.status(401).send("Unauthorized")
            else next()
        })
        .catch(() => res.status(401).send("Unauthorized"));
}

module.exports = isAuthenticated;