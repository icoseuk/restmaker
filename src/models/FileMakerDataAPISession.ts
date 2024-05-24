import FileMakerDataAPIHTTPException from '../exceptions/FileMakerDataAPIHTTPException'
import FileMakerDataAPIOperationException from '../exceptions/FileMakerDataAPIOperationException'
import FileMakerDataAPIResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIResponse'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'

/**
 * A class that provides the version of the FileMaker Data API to use.
 */
export default class FileMakerDataAPISession {
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
   * Creates a new FileMaker Data API authenticated session.
   *
   * @param username The username to use for authentication.
   * @param password The password to use for authentication.
   * @param host The FileMaker Server host.
   * @param database The FileMaker database to use.
   * @param apiVersion The version of the FileMaker Data API to use.
   */
  constructor(
    username: string,
    password: string,
    host: string,
    database: string,
    apiVersion: FileMakerDataAPIVersion = 'vLatest'
  ) {
    this.host = host
    this.database = database
    this.username = username
    this.password = password
    this.apiVersion = apiVersion
  }

  /**
   * Sends a request to the FileMaker Data API.
   *
   * @param endpoint The database specific endpoint to send the request to.
   * @param method The HTTP method to use for the request.
   * @param authentication The type of authentication to use for the request. Can be 'basic' or 'bearer'.
   */
  request = async <FileMakerDataAPIResponseData>(
    endpoint: RequestInfo | URL,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: unknown = {},
    authentication: 'basic' | 'bearer' = 'bearer'
  ) => {
    const authorizationHeader =
      authentication === 'basic'
        ? `Basic ${btoa(`${this.username}:${this.password}`)}`
        : `Bearer ${this.token}`

    // Authenticate with the FileMaker Data API
    const response = await fetch(
      `https://${this.host}/fmi/data/${this.apiVersion}/databases/${this.database}${endpoint}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationHeader
        },
        body: JSON.stringify(body)
      }
    )

    // Parse the response JSON.
    const data =
      (await response.json()) as FileMakerDataAPIResponse<FileMakerDataAPIResponseData>

    // Check for an error message.
    if (data.messages[0].code !== '0') {
      throw new FileMakerDataAPIOperationException(
        'The operation was unsuccessful.',
        data.messages[0]
      )
    }

    // Return the response.
    return data.response
  }

  /**
   * Authenticates with the FileMaker Data API.
   *
   * This method sends a request to the FileMaker Data API to retrieve a session token.
   *
   * @throws {FileMakerDataAPIHTTPException} If an error occurs while interacting with the FileMaker Data API.
   * @throws {FileMakerDataAPIOperationException} If an error occurs while interacting with the FileMaker Data API.
   */
  logIn = async () => {
    const response = await this.request<{ token: string }>(
      '/sessions',
      'POST',
      {},
      'basic'
    )
    this.token = response.token
  }

  /**
   * Logs out of the FileMaker Data API.
   *
   * This method deletes the session token from the FileMaker Data API
   * from internal state.
   *
   * @throws {FileMakerDataAPIHTTPException} If an error occurs while interacting with the FileMaker Data API.
   * @throws {FileMakerDataAPIOperationException} If an error occurs while interacting with the FileMaker Data API.
   */
  logOut = async () => {
    if (!this.token) return
    await this.request(`/sessions/${this.token}`, 'DELETE')
    this.token = undefined
  }
}
