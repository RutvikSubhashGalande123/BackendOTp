const keys = {
    development: require("./keys.dev"),
    testing: require("./keys.test"),
    local: require("./keys.local"),
    production: require("./keys.prod")
};

const environment = process.env.NODE_ENV || 'production';
module.exports = keys[environment.toLowerCase()];