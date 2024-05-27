import FileMakerOperationStatus from '../FileMakerOperationStatus'

/**
 * A generic response from the FileMaker Data API.
 *
 * @template FileMakerDataAPIResponseData  The type of the nested response object.
 */
type FileMakerDataAPIResponse<
  FileMakerDataAPIResponseData = Record<string, unknown>
> = {
  /**
   * The status of the operation.
   */
  messages: FileMakerOperationStatus[]

  /**
   * The response data.
   */
  response: FileMakerDataAPIResponseData & {
    /**
     * The error code from the request script execution.
     */
    scriptError?: string

    /**
     * The error code from the prerequest script execution.
     */
    'scriptError.prerequest'?: string

    /**
     * The error code from the presort script execution.
     */
    'scriptError.presort'?: string

    /**
     * The result from the request script execution.
     */
    scriptResult?: string

    /**
     * The result from the presort script execution.
     */
    'scriptResult.prerequest'?: string

    /**
     * The result from the presort script execution.
     */
    'scriptResult.presort'?: string
  }
}

export default FileMakerDataAPIResponse
