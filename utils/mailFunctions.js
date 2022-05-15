const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const dotenv = require("dotenv");
dotenv.config();

const sendMail = (receiver, sender, subject, msg) => {
  const msgToSend = {
    to: receiver,
    from: sender,
    subject: subject,
    text: msg,
    //html: "...",
  };

  sgMail
    .send(msgToSend)
    .then((response) => {
      console.log(response[0].statusCode);
      return response[0].statusCode;
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
    sendMail,
}