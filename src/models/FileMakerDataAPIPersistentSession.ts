import { FileMakerDataAPIClientOptions } from '../types/FileMakerDataAPIClient/FileMakerDataAPIClientInterface'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'
import FileMakerDataAPISession from './FileMakerDataAPISession'
import FileMakerDataAPIToken from './FileMakerDataAPIToken'

type FileMakerDataAPIPersistentSessionOptions = {
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

  /**
   * The encryption key for persistent mode.
   */
  tokenEncryptionKey: Required<FileMakerDataAPIClientOptions>['persistentMode']['tokenEncryptionKey']

  /**
   * The existing encrypted token for persistent mode.
   */
  existingEncryptedToken:
    | Required<FileMakerDataAPIClientOptions>['persistentMode']['existingEncryptedToken']
    | null
}

/**
 * Represents a persistent session for the FileMaker Data API.
 */
export default class FileMakerDataAPIPersistentSession extends FileMakerDataAPISession {
  /**
   * The persistent mode options for the FileMaker Data API.
   */
  protected tokenEncryptionKey: Required<FileMakerDataAPIClientOptions>['persistentMode']['tokenEncryptionKey']

  /**
   * The encrypted token initially given from the client, if any.
   */
  protected encryptedToken:
    | Required<FileMakerDataAPIClientOptions>['persistentMode']['existingEncryptedToken']
    | null

  /**
   * Creates a new FileMaker Data API persistent authenticated session.
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
    apiVersion = 'vLatest',
    tokenEncryptionKey,
    existingEncryptedToken = null
  }: FileMakerDataAPIPersistentSessionOptions) {
    super({ username, password, host, database, apiVersion })
    this.tokenEncryptionKey = tokenEncryptionKey
    this.encryptedToken = existingEncryptedToken ?? null
  }

  /**
   * Validate the session by decrypting the token and checking if it is expired.
   */
  validateSession = async (): Promise<boolean> => {
    if (!this.encryptedToken) {
      return Promise.resolve(false)
    }

    const decryptedToken = FileMakerDataAPIToken.decrypt(
      this.tokenEncryptionKey,
      this.encryptedToken
    )

    if (decryptedToken.expired()) {
      this.encryptedToken = null
      FileMakerDataAPIPersistentSession.token = undefined
      return false
    }

    FileMakerDataAPIPersistentSession.token = decryptedToken
    return true
  }

  /**
   * Overrides the default session creation method to update the encrypted token property.
   */
  create = async (): Promise<FileMakerDataAPIToken> => {
    const newToken = await super.create()
    this.encryptedToken = newToken.encrypt(this.tokenEncryptionKey)
    return newToken
  }

  /**
   * Retrieves the encrypted token for later use.
   *
   * @returns The encrypted token.
   */
  public async persist() {
    if (!this.encryptedToken) {
      await this.create()
    }
    return this.encryptedToken as string
  }
}
