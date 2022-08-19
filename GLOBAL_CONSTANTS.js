const os = require('os');
const path = require('path');

module.exports = {
    ROOT_DIRECTORY: __dirname,
    OS: os.type(),
    LOG_DIRECTORY: path.join(__dirname, 'private', '_logs'),
    PRIVATE: path.join(__dirname, 'private'),
    LOG_VIEW: path.join(__dirname, 'private', 'index.html'),
    // SECRETKEY: "$2b$10$oRmsZEDlWP2gYFwS1FetIOFnOCWdfQ/tsLkq/3XuyzCnbcFxmGJXC"
    SECRETKEY: "THISISSIMPLESECRETKEY"
    // ! If Linux OS then / else for windows \
    // LOG_DIRECTORY: "Windows_NT".localeCompare(this.OS) === 0 ? `${__dirname}/public/logs/` : `${__dirname}\\public\\logs\\`,
}