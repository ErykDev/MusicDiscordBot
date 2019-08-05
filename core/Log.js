'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `.logs/index.log`,
  datePattern: 'YYYY-MM-DD'
});

const log = new createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
    //new transports.File({ "../index.log" })
  ]
});

module.exports = log;
