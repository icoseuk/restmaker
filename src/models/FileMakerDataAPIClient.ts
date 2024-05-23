import FileMakerDataAPIHTTPException from '../exceptions/FileMakerDataAPIHTTPException'
import FileMakerDataAPIOperationException from '../exceptions/FileMakerDataAPIOperationException'
import FileMakerDataAPIResponse from '../interfaces/FileMakerDataAPIResponse'
import FileMakerDataAPISessionResponse from '../interfaces/FileMakerDataAPISessionResponse'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'

/**
 * A class that provides the version of the FileMaker Data API to use.
 *
 * @abstract
 */
export default class FileMakerDataAPIClient {
  /**
   * The FileMaker Server host.
   */
  protected host: string

  /**
   * The FileMaker database to use.
   */
  protected database: string

  /**
   * The username to use for authentication.
   */
  private username: string

  /**
   * The password to use for authentication.
   */
  private password: string

  /**
   * The token to use for authentication.
   */
  private token?: string

  /**
   * The version of the FileMaker Data API to use.
   */
  protected apiVersion: FileMakerDataAPIVersion = 'vLatest'

  /**
   * Creates a new FileMakerDataAPI instance.
   *
   * @param username The username to use for authentication.
   * @param password The password to use for authentication.
   * @param token The token to use for authentication.
   */
  constructor(
    username: string,
    password: string,
    host: string,
    application: string,
    apiVersion: FileMakerDataAPIVersion = 'vLatest'
  ) {
    this.host = host
    this.database = application
    this.username = username
    this.password = password
    this.apiVersion = apiVersion
  }

  /**
   * Authenticates with the FileMaker Data API.
   *
   * @throws {FileMakerDataAPIHTTPException} If an error occurs while interacting with the FileMaker Data API.
   * @throws {FileMakerDataAPIOperationException} If an error occurs while interacting with the FileMaker Data API.
   */
  authenticate = async () => {
    // Authenticate with the FileMaker Data API
    const response = await fetch(
      `https://${this.host}/fmi/data/${this.apiVersion}/databases/${this.database}/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`
        },
        body: JSON.stringify({})
      }
    )

    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new FileMakerDataAPIHTTPException(
        'Failed to authenticate with the FileMaker Data API',
        response.status as FileMakerDataAPIHTTPCode
      )
    }

    // Parse the response JSON.
    const data = (await response.json()) as FileMakerDataAPISessionResponse

    // Check for an error message.
    if (data.messages[0].code !== '0') {
      throw new FileMakerDataAPIOperationException(
        'Failed to authenticate with the FileMaker Data API',
        data.messages[0]
      )
    }

    // Return the token.
    return data.response.token
  }

  assert = (response: FileMakerDataAPIResponse) => {
    return response.messages[0].code === '0'
  }
}
