import FileMakerDataAPIRecord from '../types/FileMakerDataAPIRecord'
import FileMakerDataAPICreateRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPICreateRecordResponse'
import FileMakerDataAPIEditRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIEditRecordResponse'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'
import FileMakerDataAPISession from './FileMakerDataAPISession'

export default class FileMakerDataAPIClient {
  /**
   * The FileMaker Data API session.
   */
  protected session: FileMakerDataAPISession

  /**
   * Initializes a new FileMaker Data API client.
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
    this.session = new FileMakerDataAPISession(
      username,
      password,
      host,
      database,
      apiVersion
    )
  }

  /**
   * Log in explicitly to the FileMaker Data API.
   */
  logIn = async () => this.session.logIn()

  /**
   * Log out explicitly from the FileMaker Data API session.
   */
  logOut = async () => this.session.logOut()

  /**
   * Creates a new record in the specified layout.
   *
   * @param layout The layout to create the record in.
   * @param fieldData The fields to set in the new record.
   * @returns The response from the FileMaker Data API.
   */
  createRecord = async <FieldData = FileMakerDataAPIRecord['fieldData']>(
    layout: string,
    fieldData: FieldData
  ) => {
    return this.session.request<FileMakerDataAPICreateRecordResponse>(
      `/layouts/${layout}/records`,
      'POST',
      {
        fieldData
      }
    )
  }

  /**
   * Edits a record in the specified layout.
   *
   * @param layout The layout to edit the record in.
   * @param recordId The ID of the record to edit.
   * @param fieldData The fields to set in the record.
   * @param portalData The portal data to set in the record.
   * @param deleteRelated The related record to delete. The format is `portalName.portalRowId`.
   * @returns The response from the FileMaker Data API.
   */
  editRecord = async <
    FieldData = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >(
    layout: string,
    recordId: string,
    fieldData: FieldData,
    portalData: PortalData,
    deleteRelated?:
      | `${Extract<keyof PortalData, string>}.${number}`
      | Array<`${Extract<keyof PortalData, string>}.${number}`>
  ) => {
    return this.session.request<FileMakerDataAPIEditRecordResponse>(
      `/layouts/${layout}/records/${recordId}`,
      'PATCH',
      {
        fieldData,
        portalData,
        deleteRelated
      }
    )
  }
}
