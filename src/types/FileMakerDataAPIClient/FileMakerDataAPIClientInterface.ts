import {
  CreateRecordParameters,
  DeleteRecordParameters,
  DuplicateRecordParameters,
  EditRecordParameters,
  FindParameters,
  GetRecordParameters,
  GetRecordRangeParameters,
  RunScriptParameters,
  UpdateContainerDataParameters
} from './FileMakerDataAPIClientMethodParameters'
import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'
import FileMakerDataAPICreateRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPICreateRecordResponse'
import FileMakerDataAPIDuplicateRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIDuplicateRecordResponse'
import FileMakerDataAPIEditRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIEditRecordResponse'
import FileMakerDataAPIGetRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIGetRecordResponse'
import FileMakerDataAPIResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIResponse'
import FileMakerDataAPIRunScriptResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIRunScriptResponse'
import FileMakerDataAPIVersion from '../FileMakerDataAPIVersion'

/**
 * The options for the FileMaker Data API client.
 */
export type FileMakerDataAPIClientOptions = {
  /**
   * The host URL of the FileMaker server.
   */
  host: string
  /**
   * The name of the FileMaker database.
   */
  database: string
  /**
   * The username for authentication.
   */
  username: string
  /**
   * The password for authentication.
   */
  password: string
  /**
   * The version of the FileMaker Data API.
   */
  apiVersion?: FileMakerDataAPIVersion
  /**
   * The Persistent Mode options. If this is set, the client will use the Persistent Mode.
   */
  persistentMode?: {
    /**
     * The encryption key for persistent mode.
     */
    tokenEncryptionKey: string
    /**
     * The existing encrypted token for persistent mode.
     */
    existingEncryptedToken?: string
  }

  /**
   * The Profiling Mode toggle.
   */
  profilingMode?: boolean
}

/**
 * Represents the client for the FileMaker Data API.
 */
interface FileMakerDataAPIClientInterface {
  /**
   * Log in explicitly to the FileMaker Data API.
   */
  logIn(): Promise<void>

  /**
   * Log out explicitly from the FileMaker Data API session.
   */
  logOut(): Promise<void>

  /**
   * Creates a new record in the specified layout.
   */
  createRecord<FieldData extends FileMakerDataAPIRecord['fieldData']>(
    params: CreateRecordParameters<FieldData>
  ): Promise<FileMakerDataAPICreateRecordResponse>

  /**
   * Edits a record in the specified layout.
   */
  editRecord<
    FieldData extends FileMakerDataAPIRecord['fieldData'],
    PortalData extends {
      [key: string]: Record<string, unknown>
    }
  >(
    params: EditRecordParameters<FieldData, PortalData>
  ): Promise<FileMakerDataAPIEditRecordResponse>

  /**
   * Duplicate a record in the specified layout.
   */
  duplicateRecord(
    params: DuplicateRecordParameters
  ): Promise<FileMakerDataAPIDuplicateRecordResponse>

  /**
   * Deletes a record in the specified layout.
   */
  deleteRecord(
    params: DeleteRecordParameters
  ): Promise<FileMakerDataAPIResponse['response']>

  /**
   * Get a single record in the specified layout.
   */
  getRecord<
    FieldData extends FileMakerDataAPIRecord['fieldData'],
    PortalData extends {
      [key: string]: Record<string, unknown>
    }
  >(
    params: GetRecordParameters
  ): Promise<FileMakerDataAPIGetRecordResponse<FieldData, PortalData>>

  /**
   * Get a range of records in the specified layout.
   */
  getRecordRange<
    FieldData extends FileMakerDataAPIRecord['fieldData'],
    PortalData extends {
      [key: string]: Record<string, unknown>
    }
  >(
    params: GetRecordRangeParameters
  ): Promise<FileMakerDataAPIGetRecordResponse<FieldData, PortalData>>

  /**
   * Find records in the specified layout.
   */
  find<
    FieldData extends FileMakerDataAPIRecord['fieldData'],
    PortalData extends {
      [key: string]: Record<string, unknown>
    }
  >(
    params: FindParameters<FieldData>
  ): Promise<FileMakerDataAPIGetRecordResponse<FieldData, PortalData>>

  /**
   * Update the data in a container field.
   */
  updateContainerData(
    params: UpdateContainerDataParameters
  ): Promise<FileMakerDataAPIResponse['response']>

  /**
   * Execute a script in the specified layout.
   */
  runScript(
    params: RunScriptParameters
  ): Promise<FileMakerDataAPIRunScriptResponse>

  /**
   * Returns an encrypted version of the FileMaker Data API session token.
   */
  token(): Promise<string>
}

export default FileMakerDataAPIClientInterface
