const date = require("./date");
const fs = require('fs');
const CONSTANTS = require("../GLOBAL_CONSTANTS");
const path = require("path");

const PATH = CONSTANTS.LOG_DIRECTORY

function appendLog(type, content, error) {

    const logfile = path.join(PATH, `debug-${date.getDate()}.log`)


    const log = {
        status: type,
        date: date.getDateAndTime(),
        content: content,
        error: error,
    }

    fs.writeFile(logfile, `${JSON.stringify(log, null, 2)},\n`, { flag: 'a+' }, err => {
        if (err) {
            console.error(err);
        }
    });

}

module.exports = {
    appendLog
}