const nodemailer = require("nodemailer");
const { PASSWORD_SEND_EMAILS, EMAIL_WILL_SEND } = process.env;

const transport = {
  //configuración para enviar email

  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_WILL_SEND,
    pass: PASSWORD_SEND_EMAILS,
  },
};

const transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  }
});

let accountCreatedEmail = (userEmail = "") => {
  transporter
    .sendMail({
      to: userEmail,
      from: EMAIL_WILL_SEND,
      subject: "Bienvenido a la API Alkemy de Disney!",
      html: `<!DOCTYPE html>
        <html>
        
        <head>
          <meta charset='utf-8'>
          <meta name='viewport' content='width=device-width, initial-scale=1'>
        </head>
        
        <body style=" font-family: 'Open Sans', 'Arial Narrow', Arial, sans-serif; ">
          <div
            <h1>Crea, lee y edita personajes, peliculas y sus generos con esta API, ¡Que te diviertas!</h1>
          </div>
        </body>
        
        </html>`,
    })
    .then((resp) => {
      return resp;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = {
  accountCreatedEmail,
};
