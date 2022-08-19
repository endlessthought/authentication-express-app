const jwt = require("jsonwebtoken");
const GLOBAL_CONSTANTS = require("./GLOBAL_CONSTANTS");
const { appendLog } = require("./util/logger");


module.exports = async (request, response, next) => {
    try {
        //   get the token from the authorization header
        appendLog("Test", await request.headers.authorization.split(" "))
        const token = await request.headers.authorization.split(" ")[1];
        appendLog("Test", { "token": token })

        //check if the token matches the supposed origin
        const decodedToken = await jwt.verify(
            token,
            GLOBAL_CONSTANTS.SECRETKEY
        );

        appendLog("Test", { "decodedToken": decodedToken })

        const user = await decodedToken;

        appendLog("Test", { "user": user })

        // pass the the user down to the endpoints here
        request.user = user;

        // pass down functionality to the endpoint
        next();

    } catch (error) {
        appendLog("Error", "Error while decoding JWT", error.message)

        response.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
}
