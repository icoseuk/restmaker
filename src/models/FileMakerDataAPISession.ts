import FileMakerDataAPIOperationException from '../exceptions/FileMakerDataAPIOperationException'
import FileMakerDataAPIResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIResponse'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'
import chalk from 'chalk'

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
  private static token?: string

  /**
   * The version of the FileMaker Data API to use.
   */
  protected apiVersion: FileMakerDataAPIVersion = 'vLatest'

  /**
   * Whether to enable profiling for the FileMaker Data API.
   */
  protected profiling?: boolean = false

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
    // Check if the host starts with http:// or https://, if not, prepend https://
    // This forces the host to be a valid and secure URL.
    if (!host.startsWith('http://') && !host.startsWith('https://')) {
      this.host = `https://${host}`
    } else {
      this.host = host
    }
    this.database = database
    this.username = username
    this.password = password
    this.apiVersion = apiVersion
  }

  /**
   * Sends a multipart request to the FileMaker Data API.
   *
   * @param endpoint The database specific endpoint to send the request to.
   * @param body The body of the request to send.
   */
  multipartRequest = async <FileMakerDataAPIResponseData>(
    endpoint: string,
    body: FormData
  ) => {
    // Ensure the session is open.
    await this.open()

    // Authenticate with the FileMaker Data API
    const response = await this.profiledRequest(
      `${this.host}/fmi/data/${this.apiVersion}/databases/${this.database}${endpoint}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${FileMakerDataAPISession.token}`
        },
        body
      }
    )

    return this.interpretJsonResponse<FileMakerDataAPIResponseData>(response)
  }

  /**
   * Sends a request to the FileMaker Data API.
   *
   * @param endpoint The database specific endpoint to send the request to.
   * @param method The HTTP method to use for the request.
   * @param authentication The type of authentication to use for the request. Can be 'basic' or 'bearer'.
   */
  request = async <
    FileMakerDataAPIResponseData,
    FileMakerDataAPIRequestData = object
  >(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    body: FileMakerDataAPIRequestData = {} as FileMakerDataAPIRequestData,
    authentication: 'basic' | 'bearer' = 'bearer'
  ): Promise<
    FileMakerDataAPIResponse<FileMakerDataAPIResponseData>['response']
  > => {
    // Ensure the session is open.
    if (authentication === 'bearer') await this.open()

    // Authenticate with the FileMaker Data API
    const response = await this.profiledRequest(
      `${this.host}/fmi/data/${this.apiVersion}/databases/${this.database}${endpoint}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            authentication === 'basic'
              ? `Basic ${btoa(`${this.username}:${this.password}`)}`
              : `Bearer ${FileMakerDataAPISession.token}`
        },
        body: method === 'GET' ? undefined : JSON.stringify(body)
      }
    )

    return this.interpretJsonResponse<FileMakerDataAPIResponseData>(response)
  }

  /**
   * Sends a request to the FileMaker Data API to validate a session token.
   *
   * @param token The session token to validate.
   *
   * @returns The response from the request.
   */
  validateSession = async () =>
    await fetch(`${this.host}/fmi/data/${this.apiVersion}/validateSession`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${FileMakerDataAPISession.token}`
      }
    })

  /**
   * Interprets a JSON response from the FileMaker Data API and checks for errors.
   *
   * @param response The response to interpret.
   */
  interpretJsonResponse = async <FileMakerDataAPIResponseData>(
    response: Response
  ) => {
    // Parse the response JSON.
    let data: FileMakerDataAPIResponse<FileMakerDataAPIResponseData>
    try {
      data =
        (await response.json()) as FileMakerDataAPIResponse<FileMakerDataAPIResponseData>
    } catch (error) {
      if (!response.ok) {
        throw new FileMakerDataAPIOperationException(
          'The operation was unsuccessful.',
          {
            code: response.status.toString(),
            message: response.statusText
          }
        )
      } else {
        throw error
      }
    }

    // Check for an error message.
    data.messages.forEach((message) => {
      if (message.code !== '0') {
        throw new FileMakerDataAPIOperationException(
          'The operation was unsuccessful.',
          message
        )
      }
    })

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
  open = async (): Promise<boolean> => {
    if (FileMakerDataAPISession.token === undefined) {
      // Start a new session.
      FileMakerDataAPISession.token = await this.create()
      return true
    } else {
      // Validate if the current session has not expired.
      const sessionValidationResponse = await this.validateSession()
      if (sessionValidationResponse.status === 401) {
        FileMakerDataAPISession.token = await this.create()
        return true
      }
    }
    return false
  }

  /**
   * Creates a new session with the FileMaker Data API.
   *
   * This method sends a request to the FileMaker Data API to create a new session.
   */
  create = async () => {
    const response = await this.request<{ token: string }>(
      '/sessions',
      'POST',
      {},
      'basic'
    )
    FileMakerDataAPISession.token = response.token
    return response.token
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
  close = async () => {
    if (!FileMakerDataAPISession.token) return

    // End the session.
    await this.request(`/sessions/${FileMakerDataAPISession.token}`, 'DELETE')

    // Clear the session token.
    FileMakerDataAPISession.token = undefined
  }

  /**
   * Toggle profiling for FileMaker Data API session requests.
   *
   * @param profiling Whether to enable profiling for the FileMaker Data API.
   * @returns The current instance of the FileMaker Data API session.
   */
  withProfiling = (profiling: boolean) => {
    this.profiling = profiling
    return this
  }

  /**
   * Reports the time taken for an operation to execute.
   *
   * @param request The request to execute and report the time taken.
   * @returns The response of the request.
   */
  profiledRequest = async (input: string, options: RequestInit) => {
    const profileTimer = Date.now()
    const response = await fetch(input, options)
    if (this.profiling) {
      const time = chalk.green(Date.now() - profileTimer)
      console.log(
        `Request to %c${chalk.grey(input)} took ${time}ms.`,
        'color: #00f'
      )
    }
    return response
  }
}
