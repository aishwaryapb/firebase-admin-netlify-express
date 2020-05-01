const admin = require('firebase-admin');

const isAuthenticated = (req, res, next) => {
    const idToken = req.headers.authorization;
    if (!idToken) {
        return res.status(401).send("Unauthorized");
    }

    admin.auth().verifyIdToken(idToken)
        .then(() => next())
        .catch(() => res.status(401).send("Unauthorized"));
}

module.exports = isAuthenticated;