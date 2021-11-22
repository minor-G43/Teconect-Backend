var admin = require("firebase-admin");

var serviceAccount = require("google-credentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore();

const CreateCollection = async (userid) => {
    return await db.collection(`${userid}`).add({
        friend :[],
        inreq :[],
        outreq:[]
    });
}


module.exports = CreateCollection;