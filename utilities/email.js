const nodemailer = require("nodemailer");
const catchAsync = require("./catchAsync");
const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAI_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

    // Activate in gmail 'less secure app' option
  });
  // set options
  const mailOptions = {
    from: "Ali Afshar <aliafshardev@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
