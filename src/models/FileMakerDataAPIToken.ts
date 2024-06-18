import crypto from 'crypto'

type FileMakerDataAPITokenOptions = {
  /**
   * The token value.
   */
  value: string

  /**
   * The expiration timestamp of the token, in milliseconds.
   */
  expiration?: number | null
}

/**
 * Represents a token for the FileMaker Data API.
 *
 * This token is used for authentication with the FileMaker Data API,
 * and to keep tabs on the expiration of the token.
 */
export default class FileMakerDataAPIToken {
  /**
   * The token value.
   */
  protected value: string

  /**
   * The expiration timestamp of the token, in milliseconds.
   */
  protected expirationTimestamp: number

  /**
   * Creates a new FileMaker Data API token.
   */
  constructor({ value, expiration = null }: FileMakerDataAPITokenOptions) {
    this.value = value
    if (expiration === null) {
      this.expirationTimestamp = this.calculateRenewedExpirationTimestamp()
    } else {
      this.expirationTimestamp = expiration
    }
  }

  /**
   * Use the token.
   */
  use() {
    this.expirationTimestamp = this.calculateRenewedExpirationTimestamp()
    return this.value
  }

  /**
   * Generate a new expiration timestamp for the token, which is 15 minutes from now.
   *
   * @returns The new expiration timestamp.
   */
  protected calculateRenewedExpirationTimestamp() {
    return Date.now() + 1000 * 60 * 15
  }

  /**
   * Check if the token is expired.
   *
   * @returns Whether the token is expired.
   */
  expired = () => Date.now() >= this.expirationTimestamp

  /**
   * Decrypt an encrypted token.
   *
   * @param encryptionSecret The encryption key.
   * @param encryptedToken The encrypted token.
   *
   * @returns The decrypted token object.
   */
  public static decrypt(
    encryptionSecret: string,
    encryptedToken: string
  ): FileMakerDataAPIToken {
    // Hash the encryptionSecret to ensure it is 32 bytes
    const hash = crypto.createHash('sha256').update(encryptionSecret).digest()
    const iv = Buffer.from(encryptedToken.slice(0, 32), 'hex') // IV is now 16 bytes, but represented as 32 hex characters
    const encryptedText = encryptedToken.slice(32, encryptedToken.length - 32) // Exclude the auth tag
    const authTag = Buffer.from(encryptedToken.slice(-32), 'hex') // Extract the auth tag
    const decipher = crypto.createDecipheriv('aes-256-gcm', hash, iv)
    decipher.setAuthTag(authTag)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    const tokenObj = JSON.parse(decrypted)
    return new FileMakerDataAPIToken({
      value: tokenObj.value,
      expiration: tokenObj.expiration
    })
  }

  /**
   * Encrypt a token.
   *
   * @param encryptionSecret The encryption key.
   * @param token The token to encrypt.
   *
   * @returns The encrypted token.
   */
  public encrypt(encryptionSecret: string): string {
    // Hash the encryptionSecret to ensure it is 32 bytes
    const hash = crypto.createHash('sha256').update(encryptionSecret).digest()

    const iv = crypto.randomBytes(16) // For AES-GCM, this is typically 16 bytes
    const cipher = crypto.createCipheriv('aes-256-gcm', hash, iv)
    let encrypted = cipher.update(JSON.stringify(this), 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag()
    return iv.toString('hex') + encrypted + authTag.toString('hex') // Append the auth tag for use in decryption
  }
}
