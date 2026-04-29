const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}]: ${stack || message}`;
});

const fileTransport = new transports.DailyRotateFile({
	filename: "logs/app-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
	level: "info",
	format: combine(timestamp(), errors({ stack: true }), logFormat),
});

const logger = createLogger({
	level: "info",
	transports: [
		new transports.Console({
			format: combine(
				colorize(),
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				errors({ stack: true }),
				logFormat
			),
		}),
		fileTransport,
	],
});

module.exports = logger;

