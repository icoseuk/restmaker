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
  response: FileMakerDataAPIResponseData
}

export default FileMakerDataAPIResponse
