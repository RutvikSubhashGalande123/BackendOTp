const nodeMailer = require("nodemailer");

let transporter = nodeMailer.createTransport({
  host: process.env.ZOHO_HOST_NAME,
  secure: process.env.ZOHO_SECURE == "true",
  port: parseInt(process.env.ZOHO_PORT),
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

const SendEmail = async (options) => {
  try {
    let response = await transporter.sendMail(options);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = SendEmail;