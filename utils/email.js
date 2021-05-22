const fs = require('fs');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const htmlToText = require('html-to-text');
const { data } = require('jquery');

module.exports = class Email {
  constructor(clubmember, url) {
    this.to = clubmember.email;
    this.firstname = clubmember.firstname;
    this.url = url;
    this.from = `BrainsTV Web Contact <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // Send the actual email
    // (1) Render HTML based on ejs templated
    const [err, html] = await new Promise((resolve) => {
      ejs.renderFile(path.join(__dirname, `../views/email/${template}.ejs`), { firstname: this.firstname, url: this.url, subject }, (err, html) => resolve([err, html]));
    });
    if (err) {
      console.log(err);
      return;
    }
    //console.log(html);
    //return html;

    // (2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };

    // (3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to BrainsTV Club!');
  }
};
