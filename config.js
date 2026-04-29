module.exports.SMTP_USER = process.env.SMTP_USER;
module.exports.SMTP_PASS = process.env.SMTP_PASS;
module.exports.DESTINATION_MAILBOX = process.env.DESTINATION_MAILBOX;
module.exports.PORT = process.env.PORT || 8000;
module.exports.TELNYX_PUBLIC_KEY = process.env.TELNYX_PUBLIC_KEY;
module.exports.TELNYX_API_KEY = process.env.TELNYX_API_KEY;

// Mailer type: 'mailjet' (default) or 'smtp'
module.exports.MAILER_TYPE = process.env.MAILER_TYPE || "mailjet";

// Mailjet API credentials (uses MAILER_USER / MAILER_PASS from .env)
module.exports.MAILJET_API_KEY = process.env.MAILER_USER;
module.exports.MAILJET_SECRET_KEY = process.env.MAILER_PASS;
module.exports.MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL;
module.exports.MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || "Telnyx SMS Forwarding";
