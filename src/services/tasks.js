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

const fetchTasksUnderCategory = (categoryId, user) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection('tasks')
            .where("user", "==", user)
            .where("categoryId", "==", categoryId)
            .orderBy("order", "asc")
            .get()
            .then(querySnapshot => {
                const data = querySnapshot?.docs?.map(doc => ({ ...doc.data(), id: doc.id })) || [];
                resolve({ [categoryId]: data });
            })
            .catch(err => {
                reject(err)
            });
    })
)

const fetchTasks = (user, categories) => (
    new Promise((resolve, reject) => {
        try {
            let allTasks = {};
            Promise.all(categories.map(category => fetchTasksUnderCategory(category.id, user)))
                .then(tasksList => {
                    tasksList.forEach((tasks) => allTasks = { ...allTasks, ...tasks });
                    resolve(allTasks);
                })
        } catch (err) {
            let msg = "Unable to fetch tasks";
            reject(msg);
        }
    })
)

const reorderTasks = (user, tasks, categoryId) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection('tasks')
            .where("user", "==", user)
            .where("categoryId", "==", categoryId)
            .get()
            .then(querySnapshot => {
                let batch = admin.firestore().batch();
                querySnapshot.docs.forEach(doc => {
                    const item = doc.data();
                    batch.update(doc.ref, { ...item, order: tasks.findIndex(task => task.id === doc.id) });
                });
                batch.commit().then(resolve());
            })
            .catch(() => {
                let msg = "Unable to reorder the tasks";
                reject(msg);
            })
    })
)

const deleteTask = (taskId) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection('tasks')
            .doc(taskId)
            .delete()
            .then(() => resolve())
            .catch(() => {
                let msg = "Unable to delete the task";
                reject(msg);
            });
    })
)

const addTask = (name, user, categoryId) => (
    new Promise(async (resolve, reject) => {
        const tasks = await fetchTasksUnderCategory(categoryId, user)
        const lastIndex = tasks[tasks.length - 1]?.order;
        const data = {
            name,
            order: lastIndex !== undefined ? lastIndex + 1 : 0,
            user,
            categoryId,
            completed: false
        };
        admin.firestore().collection('tasks')
            .add(data)
            .then((docRef) => resolve({ ...data, id: docRef.id }))
            .catch(() => {
                let msg = "Unable to add the task";
                reject(msg);
            })
    })
)

const updateTask = (task) => (
    new Promise((resolve, reject) => {
        admin.firestore().collection("tasks")
            .doc(task.id)
            .set({ ...task }, { merge: true })
            .then(() => resolve())
            .catch(() => {
                let msg = "Unable to update task";
                reject(msg);
            })
    })
)

module.exports = {
    deleteAssociatedTasks,
    fetchTasks,
    reorderTasks,
    deleteTask,
    addTask,
    updateTask
}