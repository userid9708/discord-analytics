import winston from 'winston';

const format = winston.format.printf(
  ({ level, message, label, timestamp, ...rest }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(rest).length ? JSON.stringify(rest) : ''
    }`;
  }
);

const Logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV !== 'production'
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              format
            )
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
              winston.format.prettyPrint()
            ),
    }),
  ],
});

export default Logger;
