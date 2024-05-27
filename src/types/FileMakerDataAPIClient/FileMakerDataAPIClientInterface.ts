import {
  CreateRecordParameters,
  DeleteRecordParameters,
  DuplicateRecordParameters,
  EditRecordParameters,
  FindParameters,
  GetRecordParameters,
  GetRecordRangeParameters,
  RunScriptParameters
} from './FileMakerDataAPIClientMethodParameters'
import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'
import FileMakerDataAPICreateRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPICreateRecordResponse'
import FileMakerDataAPIDuplicateRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIDuplicateRecordResponse'
import FileMakerDataAPIEditRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIEditRecordResponse'
import FileMakerDataAPIGetRecordResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIGetRecordResponse'
import FileMakerDataAPIResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIResponse'
import FileMakerDataAPIRunScriptResponse from '../FileMakerDataAPIResponse/FileMakerDataAPIRunScriptResponse'

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
    PortalData extends FileMakerDataAPIRecord['portalData']
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
  ): Promise<FileMakerDataAPIResponse>

  /**
   * Get a single record in the specified layout.
   */
  getRecord<
    FieldData extends FileMakerDataAPIRecord['fieldData'],
    PortalData extends FileMakerDataAPIRecord['portalData']
  >(
    params: GetRecordParameters
  ): Promise<FileMakerDataAPIGetRecordResponse<FieldData, PortalData>>

  /**
   * Get a range of records in the specified layout.
   */
  getRecordRange<
    FieldData extends FileMakerDataAPIRecord['fieldData'],
    PortalData extends FileMakerDataAPIRecord['portalData']
  >(
    params: GetRecordRangeParameters
  ): Promise<FileMakerDataAPIGetRecordResponse<FieldData, PortalData>>

  /**
   * Find records in the specified layout.
   */
  find<
    FieldData extends FileMakerDataAPIRecord['fieldData'],
    PortalData extends FileMakerDataAPIRecord['portalData']
  >(
    params: FindParameters<FieldData>
  ): Promise<FileMakerDataAPIGetRecordResponse<FieldData, PortalData>>

  /**
   * Execute a script in the specified layout.
   */
  runScript(
    params: RunScriptParameters
  ): Promise<FileMakerDataAPIRunScriptResponse>
}

export default FileMakerDataAPIClientInterface
