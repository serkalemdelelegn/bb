var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS.toString(),
  },
});

function sendEmail(to, subject, text) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return reject(error);
      } else {
        return resolve(info.response);
      }
    });
  });
}

module.exports = sendEmail;
