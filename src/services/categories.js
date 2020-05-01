const admin = require('firebase-admin');

const { deleteAssociatedTasks } = require('./tasks');

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

const addCategory = (user, name) => (
    new Promise((resolve, reject) => {
        fetchCategories(user)
            .then((categories) => {
                const lastIndex = categories[categories.length - 1]?.order;
                admin.firestore().collection('categories')
                    .add({
                        name,
                        order: lastIndex !== undefined ? lastIndex + 1 : 0,
                        user,
                        completed: false
                    })
                    .then(ref => resolve(ref.id))
            })
            .catch(() => {
                let msg = "Unable to add category";
                reject(msg);
            })
    })
)

const reorderCategories = (user, categories) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection('categories')
            .where("user", "==", user)
            .get()
            .then(querySnapshot => {
                let batch = admin.firestore().batch();
                querySnapshot.docs.forEach(doc => {
                    const item = doc.data();
                    batch.update(doc.ref, { ...item, order: categories.findIndex(category => category.id === doc.id) });
                });
                batch.commit().then(() => resolve());
            })
            .catch(() => {
                let msg = "Unable to reorder the categories";
                reject(msg);
            })
    })
)

const deleteCategory = (id) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection('categories')
            .doc(id)
            .delete()
            .then(() => {
                deleteAssociatedTasks(id)
                    .then(() => resolve())
            })
            .catch(() => {
                let msg = "Unable to delete the category";
                reject(msg);
            })
    })
)

const updateCategory = (category) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection("categories")
            .doc(category.id)
            .set({ ...category }, { merge: true })
            .then(() => resolve())
            .catch(() => {
                let msg = "Unable to update category";
                reject(msg);
            })
    })
)

module.exports = {
    fetchCategories,
    addCategory,
    reorderCategories,
    deleteCategory,
    updateCategory
};