/**
 * Represents a FileMaker error.
 *
 * @see {@link https://help.claris.com/en/pro-help/content/error-codes.html|FileMaker Error Codes} for more information.
 */
type FileMakerOperationStatus = {
  /**
   * The operation code.
   */
  code: string

  /**
   * The operation message.
   */
  message: string
}

export default FileMakerOperationStatus
