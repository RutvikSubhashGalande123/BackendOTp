const axios = require('axios');

const ApiCaller = async (options) => {
    try {
        const response = await axios(options);
        console.log(response.data); 
        return response.data;
    } catch (error) {
        console.error('Error in API call:', error.message);
        throw error;
    }
};

module.exports = ApiCaller;
