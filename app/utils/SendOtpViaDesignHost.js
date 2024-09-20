const callAxiosAPI = require("./ApiCaller");

const sendOTPViaDesignHost = async (mobileNumber, otpTemplate) => {
  var options = {
    method: process.env.METHOD_GET,
    url: process.env.DESIGN_HOST_URL,
    params: {
      user: process.env.DESIGN_HOST_USERNAME,
      password: process.env.DESIGN_HOST_PASSWORD,
      senderid: process.env.DESIGN_HOST_SENDER_ID,
      channel: process.env.DESIGN_HOST_CHANNEL,
      DCS: process.env.DESIGN_HOST_DCS,
      flashsms: process.env.DESIGN_HOST_FLASH_SMS,
      number: mobileNumber,
      text: otpTemplate,
      route: process.env.DESIGN_HOST_ROUTE,
      peid: process.env.DESIGN_HOST_PE_ID,
      DLTTemplateId: process.env.DESIGN_HOST_DLT_TEMPLATE_ID,
    },
  };

  let designHostResponse = callAxiosAPI(options);
  return designHostResponse;
};

module.exports = sendOTPViaDesignHost;
