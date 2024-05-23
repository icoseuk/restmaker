import FileMakerOperationStatus from '../types/FileMakerOperationStatus'

/**
 * The exception that is thrown when an error occurs while interacting
 * with the FileMaker Data API.
 */
export default class FileMakerDataAPIOperationException extends Error {
  /**
   * The status of the FileMaker operation.
   */
  public status: FileMakerOperationStatus

  constructor(message: string, status: FileMakerOperationStatus) {
    super(message)
    this.status = status
    this.name = this.constructor.name
  }

  toString(): string {
    return `${this.name}: ${this.message} (Error ${this.status.code}: ${this.status.message})`
  }
}
