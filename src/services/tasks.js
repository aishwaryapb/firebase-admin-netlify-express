const admin = require('firebase-admin');

const deleteAssociatedTasks = (categoryId) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection("tasks")
            .where("categoryId", "==", categoryId)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.docs.length !== 0) {
                    let batch = admin.firestore().batch();
                    querySnapshot.docs.forEach(doc => {
                        batch.delete(doc.ref)
                    });
                    batch.commit();
                }
                resolve();
            })
            .catch(() => {
                let msg = "Unable to delete associated tasks";
                reject(msg);
            });
    })
)

module.exports = {
    deleteAssociatedTasks
}