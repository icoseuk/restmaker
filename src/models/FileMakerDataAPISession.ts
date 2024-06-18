import FileMakerDataAPIOperationException from '../exceptions/FileMakerDataAPIOperationException'
import FileMakerDataAPIResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIResponse'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'
import chalk from 'chalk'
import FileMakerDataAPIToken from './FileMakerDataAPIToken'

type FileMakerDataAPISessionOptions = {
  /**
   * The username to use for authentication.
   */
  username: string

  /**
   * The password to use for authentication.
   */
  password: string

  /**
   * The FileMaker Server host.
   */
  host: string

  /**
   * The FileMaker database to use.
   */
  database: string

  /**
   * The version of the FileMaker Data API to use.
   */
  apiVersion?: FileMakerDataAPIVersion
}

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
  protected static token?: FileMakerDataAPIToken

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
  constructor({
    username,
    password,
    host,
    database,
    apiVersion = 'vLatest'
  }: FileMakerDataAPISessionOptions) {
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
  public async multipartRequest<FileMakerDataAPIResponseData>(
    endpoint: string,
    body: FormData
  ) {
    // Ensure the session is open.
    await this.open()

    // Authenticate with the FileMaker Data API
    const response = await this.profiledRequest(
      `${this.host}/fmi/data/${this.apiVersion}/databases/${this.database}${endpoint}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${FileMakerDataAPISession.token?.use()}`
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
  public async request<
    FileMakerDataAPIResponseData,
    FileMakerDataAPIRequestData = object
  >(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    body: FileMakerDataAPIRequestData = {} as FileMakerDataAPIRequestData,
    authentication: 'basic' | 'bearer' = 'bearer'
  ): Promise<
    FileMakerDataAPIResponse<FileMakerDataAPIResponseData>['response']
  > {
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
              : `Bearer ${FileMakerDataAPISession.token?.use()}`
        },
        body: method === 'GET' ? undefined : JSON.stringify(body)
      }
    )

    return this.interpretJsonResponse<FileMakerDataAPIResponseData>(response)
  }

  /**
   * Sends a request to the FileMaker Data API to validate a session token.
   *
   * @param strict Whether to strictly validate the session with the FileMaker Data API.
   *
   * @returns The response from the request.
   */
  protected async validateSession(strict: boolean = false): Promise<boolean> {
    if (strict) {
      const sessionValidationResponse = await this.profiledRequest(
        `${this.host}/fmi/data/${this.apiVersion}/validateSession`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${FileMakerDataAPISession.token?.use()}`
          }
        }
      )
      return sessionValidationResponse.status === 401
    }
    return (
      FileMakerDataAPISession.token !== undefined &&
      !FileMakerDataAPISession.token.expired()
    )
  }

  /**
   * Interprets a JSON response from the FileMaker Data API and checks for errors.
   *
   * @param response The response to interpret.
   */
  protected async interpretJsonResponse<FileMakerDataAPIResponseData>(
    response: Response
  ) {
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
  public async open(): Promise<boolean> {
    if (FileMakerDataAPISession.token === undefined) {
      // Start a new session.
      FileMakerDataAPISession.token = await this.create()
      return true
    } else {
      // Validate if the current session has not expired.
      const validExistingSession = await this.validateSession()
      if (!validExistingSession) {
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
  protected async create() {
    const response = await this.request<{ token: string }>(
      '/sessions',
      'POST',
      {},
      'basic'
    )

    return new FileMakerDataAPIToken({
      value: response.token
    })
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
  public async close() {
    if (!FileMakerDataAPISession.token) return

    // End the session.
    await this.request(
      `/sessions/${FileMakerDataAPISession.token.use()}`,
      'DELETE'
    )

    // Clear the session token.
    FileMakerDataAPISession.token = undefined
  }

  /**
   * Toggle profiling for FileMaker Data API session requests.
   *
   * @param profiling Whether to enable profiling for the FileMaker Data API.
   * @returns The current instance of the FileMaker Data API session.
   */
  public withProfiling(profiling: boolean) {
    this.profiling = profiling
    return this
  }

  /**
   * Reports the time taken for an operation to execute.
   *
   * @param request The request to execute and report the time taken.
   * @returns The response of the request.
   */
  protected async profiledRequest(input: string, options: RequestInit) {
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
