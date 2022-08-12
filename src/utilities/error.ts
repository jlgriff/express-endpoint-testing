import { GraphQLError } from 'graphql';

const statusCodePattern: RegExp = /(?<=status: )(.*?)(?=\s|})/;
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
    : errorMsg;

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
  return { message: 'Unparsable error', status: 500 };
};

export default handleError;
