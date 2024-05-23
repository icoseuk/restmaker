import FileMakerDataAPIResponse from './FileMakerDataAPIResponse'

/**
 * A response from opening a new session with the FileMaker Data API.
 */
interface FileMakerDataAPISessionResponse extends FileMakerDataAPIResponse {
  /**
   * The response data.
   */
  response: {
    /**
     * The session token to use for subsequent calls to the FileMaker Data API.
     */
    token: string
  }
}

export default FileMakerDataAPISessionResponse
