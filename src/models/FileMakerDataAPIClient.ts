import FileMakerDataAPIRecord from '../types/FileMakerDataAPIRecord'
import FileMakerDataAPICreateRecordRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPICreateRecordRequest'
import FileMakerDataAPIGetRecordRangeRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPIGetRecordRangeRequest'
import FileMakerDataAPIGetRecordQueryRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPIGetRecordRequest'
import FileMakerDataAPIRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPIRequest'
import FileMakerDataAPICreateRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPICreateRecordResponse'
import FileMakerDataAPIDuplicateRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIDuplicateRecordResponse'
import FileMakerDataAPIEditRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIEditRecordResponse'
import FileMakerDataAPIResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIResponse'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'
import FileMakerDataAPISession from './FileMakerDataAPISession'

/**
 * A class that provides a client for the FileMaker Data API.
 */
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
    return this.session.request<
      FileMakerDataAPICreateRecordResponse,
      FileMakerDataAPICreateRecordRequest<FieldData>
    >(`/layouts/${layout}/records`, 'POST', {
      fieldData
    })
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
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >(
    layout: string,
    recordId: string,
    fieldData: FieldData,
    portalData?: PortalData,
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

  /**
   * Duplicate a record in the specified layout.
   *
   * @param layout The layout to duplicate the record in.
   * @param recordId The ID of the record to duplicate.
   * @returns The response from the FileMaker Data API.
   */
  duplicateRecord = async (layout: string, recordId: string) => {
    return this.session.request<
      FileMakerDataAPIDuplicateRecordResponse,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records/${recordId}`, 'POST')
  }

  /**
   * Deletes a record in the specified layout.
   *
   * @param layout The layout to delete the record in.
   * @param recordId The ID of the record to delete.
   * @returns The response from the FileMaker Data API.
   */
  deleteRecord = async (layout: string, recordId: string) => {
    return this.session.request<
      FileMakerDataAPIResponse,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records/${recordId}`, 'DELETE')
  }

  /**
   * Get a single record in the specified layout.
   *
   * @param layout The layout to get the record from.
   * @param recordId The ID of the record to get.
   * @returns The response from the FileMaker Data API.
   */
  getRecord = async <
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >(
    layout: string,
    recordId: string,
    layoutResponse: string,
    portals: {
      name: string
      limit: number
      offset: number
    }[] = []
  ) => {
    // Build the query object.
    const query: FileMakerDataAPIGetRecordQueryRequest = {
      ...portals.reduce((acc, { name, limit, offset }) => {
        acc[`_offset.${name}`] = offset.toString()
        acc[`_limit.${name}`] = limit.toString()
        return acc
      }, {} as FileMakerDataAPIGetRecordQueryRequest),
      'layout.response': layoutResponse,
      portal: portals.length
        ? `[${portals.map(({ name }) => name).join(',')}]`
        : undefined
    }

    // Remove any undefined values from the query object.
    const cleanedQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    )

    // Convert the query object to a query string.
    const queryString = new URLSearchParams(cleanedQuery).toString()

    // Make the request to the FileMaker Data API.
    return this.session.request<
      FileMakerDataAPIResponse<FileMakerDataAPIRecord<FieldData, PortalData>>,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records/${recordId}?${queryString}`, 'GET')
  }

  getRecordRange = async <
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >(
    layout: string,
    startingRecordId?: 'string',
    limit?: number,
    layoutResponse?: string,
    portals: {
      name: string
      limit: number
      offset: number
    }[] = [],
    sort: {
      fieldName: string
      sortOrder: 'ascend' | 'descend'
    }[] = []
  ) => {
    // Build the query object.
    const query: FileMakerDataAPIGetRecordRangeRequest = {
      ...portals.reduce((acc, { name, limit, offset }) => {
        acc[`_offset.${name}`] = offset.toString()
        acc[`_limit.${name}`] = limit.toString()
        return acc
      }, {} as FileMakerDataAPIGetRecordQueryRequest),
      'layout.response': layoutResponse,
      portal: portals.length
        ? `[${portals.map(({ name }) => name).join(',')}]`
        : undefined,
      _offset: startingRecordId,
      _limit: limit?.toString(),
      _sort: sort.length === 0 ? undefined : sort.toString()
    }

    // Remove any undefined values from the query object.
    const cleanedQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    )

    // Convert the query object to a query string.
    const queryString = new URLSearchParams(cleanedQuery).toString()

    // Make the request to the FileMaker Data API.
    return this.session.request<
      FileMakerDataAPIResponse<FileMakerDataAPIRecord<FieldData, PortalData>[]>,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records?${queryString}`, 'GET')
  }
}
