const admin = require('firebase-admin');

const fetchCategories = (user) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection('categories')
            .where("user", "==", user)
            .orderBy("order", "asc")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot?.docs?.map(doc => ({ ...doc.data(), id: doc.id }))
                resolve(data);
            })
            .catch(err => {
                let msg = "Unable to retrieve categories";
                reject(msg);
            });
    })
);

module.exports = {
    fetchCategories: fetchCategories
};