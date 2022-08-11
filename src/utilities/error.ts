import { GraphQLError } from 'graphql';
import log from './logger';

const statusCodePattern: RegExp = /status: (d+)/;
const messagePattern: RegExp = /(?<=message: ")(.*?)(?=")/;

/**
 * Extracts the message and status code from an error string
 */
const extractErrorFromMessage = (errorMsg: string): { message: string, code: number; } => {
  const statusCodeArray: RegExpExecArray | null = statusCodePattern.exec(errorMsg);
  const code: number = statusCodeArray && statusCodeArray.length > 0
    ? parseInt(statusCodeArray[0], 10)
    : 500;

  const messageArray: RegExpExecArray | null = messagePattern.exec(errorMsg);
  const message: string = messageArray && messageArray.length > 0
    ? messageArray[0]
    : 'Unexpected error';

  if (message === 'Unexpected error') {
    log('warn', `The following error could not have its message extracted: ${errorMsg}`);
  }

  return { message, code };
};

/**
 * Formats and returns a GraphQLError with a custom message
 */
const handleError = (err: GraphQLError): { message: string, status: number; } => {
  if (err.originalError) {
    const { message, code } = extractErrorFromMessage(err.originalError.message);
    return { message, status: code };
  }
  return { message: 'Unexpected error', status: 500 };
};

export default handleError;
