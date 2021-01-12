var nodemailer = require('nodemailer');

class MailSender {
	
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'rajivkumar.mel@gmail.com',
				pass: 'mel*1234'
			}
		});
	}
	
	sendMail(mailOptions, callback) {
		this.transporter.sendMail(mailOptions, function(error, info){
			callback(error, info);
		});
	}
	
}

module.exports = {MailSender};