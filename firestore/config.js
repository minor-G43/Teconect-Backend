var admin = require("firebase-admin");

var service = process.env.Google_Config;
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(service))
})

const db = admin.firestore();

const CreateCollection = async (userid) => {
    return await db.collection(`${userid}`).doc("collection").set({
        friend: [],
        inreq: [],
        outreq: []
    });
}


module.exports = CreateCollection;