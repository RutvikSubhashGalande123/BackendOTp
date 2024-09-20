const callAxiosAPI = require("./ApiCaller");

const sendOTPViaSinthan = async (mobileNumber, otpTemplate) => {
  var options = {
    method: process.env.METHOD_GET,
    url: process.env.OTP_HOST_URL,
    params: {
      username: process.env.OTP_HOST_USERNAME,
      dest: mobileNumber,
      apikey: process.env.OTP_HOST_APIKEY,
      signature: process.env.OTP_HOST_SIGNATURE,
      msgtype: process.env.OTP_MSG_TYPE,
      msgtxt: otpTemplate,
      templateid: process.env.OTP_TEMPLATE_ID,
      entityid: process.env.OTP_ENTITY_ID,
    },
  };
  let sinthanResponse = await callAxiosAPI(options);
  return sinthanResponse;
};

module.exports = sendOTPViaSinthan;
