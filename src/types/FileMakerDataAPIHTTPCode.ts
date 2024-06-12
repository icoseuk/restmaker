/**
 * The HTTP status code returned by the FileMaker Data API.
 */
type FileMakerDataAPIHTTPCode =
  | FileMakerDataAPIOKHTTPCode
  | FileMakerDataAPIBadRequestHTTPCode
  | FileMakerDataAPIUnauthorizedHTTPCode
  | FileMakerDataAPIForbiddenHTTPCode
  | FileMakerDataAPINotFoundHTTPCode
  | FileMakerDataAPIMethodNotAllowedHTTPCode
  | FileMakerDataAPIUnsupportedMediaTypeHTTPCode
  | FileMakerDataAPIFileMakerErrorHTTPCode

/**
 * Indicates that the request was successful.
 */
type FileMakerDataAPIOKHTTPCode = 200

/**
 * Occurs when the server cannot process the request because it is incomplete or invalid.
 */
type FileMakerDataAPIBadRequestHTTPCode = 400

/**
 * Occurs when the client is not authorized to access the API. If this error occurs when attempting to log in to a database session, then there is a problem with the specified user account or password. If this error occurs with other calls, the access token is not specified or it is not valid.
 */
type FileMakerDataAPIUnauthorizedHTTPCode = 401

/**
 * Occurs when the client is authorized, but the call attempts an action that is forbidden for a different reason.
 */
type FileMakerDataAPIForbiddenHTTPCode = 403

/**
 * Occurs if the call uses a URL with an invalid URL schema. Check the specified URL for syntax errors.
 */
type FileMakerDataAPINotFoundHTTPCode = 404

/**
 * Occurs when an incorrect HTTP method is used with a call.
 */
type FileMakerDataAPIMethodNotAllowedHTTPCode = 405

/**
 * Occurs if the required header is missing or is not correct for the request:
 * For requests that require "Content-Type: application/json" header, occurs if the "Content-Type: application/json" header is not specified or if a different content type was specified instead of the "application/json" type.
 * For requests that require "Content-Type: multipart/form-data" header, occurs if the "Content-Type: multipart/form-data" header is not specified or if a different content type was specified instead of the "multipart/form-data" type.
 */
type FileMakerDataAPIUnsupportedMediaTypeHTTPCode = 415

/**
 * Includes FileMaker internal error messages and error codes.
 */
type FileMakerDataAPIFileMakerErrorHTTPCode = 500

export default FileMakerDataAPIHTTPCode
