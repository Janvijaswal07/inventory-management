const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, from_to, reply_to) => {
  const transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //option
  const option = {
    from: from_to,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  };

  // send email
  transporter.sendMail(option, function(err, info){
    if(err){
        console.log(err);
    }
    else{
        console.log(info);
    }
  })
};

module.exports = sendEmail;