const winston = require('winston');
const path = require('path');

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
  ],
});

module.exports = logger;
