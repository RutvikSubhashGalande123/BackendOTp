
const randomstring = require("randomstring");
const generateCustomRandomNumber = (length,character) => randomstring.generate({length,charset: `${character}`});
module.exports = generateCustomRandomNumber;
