/**
 * The exception that is thrown when an error occurs while interacting
 * with the FileMaker Data API.
 */
export default class FileMakerDataAPIHTTPException extends Error {
  /**
   * The HTTP code of the response.
   */
  public httpCode: FileMakerDataAPIHTTPCode

  constructor(message: string, httpCode: FileMakerDataAPIHTTPCode) {
    super(message)
    this.httpCode = httpCode
    this.name = this.constructor.name
  }

  toString(): string {
    return `${this.name}: ${this.message} (HTTP ${this.httpCode})`
  }
}
