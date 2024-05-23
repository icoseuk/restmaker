import FileMakerOperationStatus from '../types/FileMakerOperationStatus'

/**
 * A generic response from the FileMaker Data API.
 */
interface FileMakerDataAPIResponse {
  /**
   * The status of the operation.
   */
  messages: FileMakerOperationStatus[]

  /**
   * The response data.
   */
  response: {
    [key: string]: any
  }
}

export default FileMakerDataAPIResponse
