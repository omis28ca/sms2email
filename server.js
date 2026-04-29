require("dotenv").config();
var path = require("path");

const express = require("express");
const config = require("./config");
const Telnyx = require("telnyx");

const telnyx = new Telnyx({
	apiKey: config.TELNYX_API_KEY,
	publicKey: config.TELNYX_PUBLIC_KEY,
});

const sms = require("./sms");

const app = express();

app.use(
	express.json({
		verify: (req, _res, buf) => {
			req.rawBody = buf.toString("utf8");
		},
	})
);

const webhookValidator = async (req, res, next) => {
	try {
		await telnyx.webhooks.unwrap(req.rawBody, {
			headers: req.headers,
		});
		next();
	} catch (e) {
		console.log(`Invalid webhook: ${e.message}`);
		return res.status(400).send(`Webhook Error: ${e.message}`);
	}
};

app.use("/sms", webhookValidator, sms);
app.post("/message/callbacks/status", (req, res) => {
	res.sendStatus(200);
	const event = req.body.data;
	console.log(`Received Status Callback: ${event.event_type}`);
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(config.PORT);
console.log(`Server listening on port ${config.PORT}`);
