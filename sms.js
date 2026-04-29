require("dotenv").config();
const nodemailer = require("nodemailer");
const Mailjet = require("node-mailjet");
const config = require("./config");
const express = require("express");
const logger = require("./logger");

const router = (module.exports = express.Router());

const smsRouter = async (req, res) => {
	res.sendStatus(200);
	const event = req.body.data;

	logger.info(`Webhook received: event_type="${event.event_type}" message_id="${event.payload?.id}"`);

	switch (event.event_type) {
		case "message.received":
			logger.info(
				`SMS received: from="${event.payload.from.phone_number}" ` +
				`to="${event.payload.to?.[0]?.phone_number}" ` +
				`received_at="${event.payload.received_at}" ` +
				`body="${event.payload.text}"`
			);
			sendEmail(event);
			break;
		case "message.sent":
			logger.info(`SMS sent confirmation: message_id="${event.payload?.id}"`);
			break;
		default:
			logger.warn(`Unhandled event type: "${event.event_type}"`);
			break;
	}
};

const sendEmail = async (event) => {
	try {
		const smsFrom = event.payload.from.phone_number;
		const smsReceivedAt = event.payload.received_at;
		const smsBody = event.payload.text;

		if (config.MAILER_TYPE === "smtp") {
			await sendViaSMTP(smsFrom, smsReceivedAt, smsBody);
			logger.info(`Email sent via SMTP: to="${config.DESTINATION_MAILBOX}" from="${smsFrom}"`);
		} else {
			await sendViaMailjet(smsFrom, smsReceivedAt, smsBody);
			logger.info(`Email sent via Mailjet: to="${config.DESTINATION_MAILBOX}" from="${smsFrom}"`);
		}
	} catch (e) {
		logger.error(`Error sending email: ${e.message}`, { stack: e.stack });
	}
};

const sendViaSMTP = async (smsFrom, smsReceivedAt, smsBody) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: config.SMTP_USER,
			pass: config.SMTP_PASS,
		},
	});
	await transporter.sendMail({
		from: `Telnyx SMS Forwarding <${config.SMTP_USER}>`,
		to: config.DESTINATION_MAILBOX,
		subject: `New SMS Message from ${smsFrom}`,
		text: `Message: ${smsBody}\nReceived at: ${smsReceivedAt}`,
	});
};

const sendViaMailjet = async (smsFrom, smsReceivedAt, smsBody) => {
	const mailjet = Mailjet.apiConnect(config.MAILJET_API_KEY, config.MAILJET_SECRET_KEY);
	await mailjet.post("send", { version: "v3.1" }).request({
		Messages: [
			{
				From: {
					Email: config.MAILJET_FROM_EMAIL,
					Name: config.MAILJET_FROM_NAME,
				},
				To: [{ Email: config.DESTINATION_MAILBOX }],
				Subject: `New SMS Message from ${smsFrom}`,
				TextPart: `Message: ${smsBody}\nReceived at: ${smsReceivedAt}`,
			},
		],
	});
};

router.route("/telnyx-webhook").post(smsRouter);
