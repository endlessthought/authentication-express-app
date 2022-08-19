// external imports
const mongoose = require("mongoose");
require('dotenv').config()

const logger = require("../util/logger");

async function dbConnect() {
    // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
    mongoose
        .connect(
            process.env.DB_URL,
            {
                //   these are options to ensure that the connection is done properly
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // Deprecated : https://www.mongodb.com/community/forums/t/option-usecreateindex-is-not-supported/123048
                // useCreateIndex: true,
            }
        ).then(() => {
            logger.appendLog("SUCCESS", "Successfully connected to MongoDB Atlas!")
        })
        .catch((error) => {
            logger.appendLog("ERROR", "Unable to connect to MongoDB Atlas!", error)
        });

}

module.exports = dbConnect;