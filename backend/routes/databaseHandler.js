const mongoose = require('mongoose');

function connectToDb() {
    mongoose.Promise = global.Promise;

    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
    }).then(() => {
        console.log("successfully connected to mongodb");
    }).catch((err) => {
        console.log("error connecting to mongodb: ", err);
        process.exit();
    });
}

module.exports = {
    connectToDb
}