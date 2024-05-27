import FileMakerDataAPIClientInterface from '../types/FileMakerDataAPIClient/FileMakerDataAPIClientInterface'
import {
  CreateRecordParameters,
  DeleteRecordParameters,
  DuplicateRecordParameters,
  EditRecordParameters,
  FindParameters,
  GetRecordParameters,
  GetRecordRangeParameters,
  RequestLifecycleScriptExecution,
  RunScriptParameters
} from '../types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
import FileMakerDataAPIRecord from '../types/FileMakerDataAPIRecord'
import FileMakerDataAPICreateRecordRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPICreateRecordRequest'
import FileMakerDataAPIFindRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPIFindRequest'
import FileMakerDataAPIGetRecordRangeRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPIGetRecordRangeRequest'
import FileMakerDataAPIGetRecordQueryRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPIGetRecordRequest'
import FileMakerDataAPIRequest from '../types/FileMakerDataAPIRequest/FileMakerDataAPIRequest'
import FileMakerDataAPICreateRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPICreateRecordResponse'
import FileMakerDataAPIDuplicateRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIDuplicateRecordResponse'
import FileMakerDataAPIEditRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIEditRecordResponse'
import FileMakerDataAPIGetRecordResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIGetRecordResponse'
import FileMakerDataAPIResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIResponse'
import FileMakerDataAPIRunScriptResponse from '../types/FileMakerDataAPIResponse/FileMakerDataAPIRunScriptResponse'
import FileMakerDataAPIVersion from '../types/FileMakerDataAPIVersion'
import FileMakerDataAPISession from './FileMakerDataAPISession'

/**
 * A class that provides a client for the FileMaker Data API.
 */
export default class FileMakerDataAPIClient
  implements FileMakerDataAPIClientInterface
{
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

  logIn = async () => {
    await this.session.open()
  }

  logOut = async () => {
    await this.session.close()
  }

  /**
   * Parses the script execution parameters into the compatible query object.
   */
  protected parseScriptRequest = ({
    script,
    prerequestScript,
    presortScript
  }: RequestLifecycleScriptExecution): FileMakerDataAPIRequest<{}> => {
    const query = {
      script: script?.name,
      'script.param': script?.param,
      'script.prerequest': prerequestScript?.name,
      'script.prerequest.param': prerequestScript?.param,
      'script.presort': presortScript?.name,
      'script.presort.param': presortScript?.param
    }

    // Remove undefined values from the query object.
    return Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    )
  }

  createRecord = async <
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData']
  >({
    layout,
    fieldData,
    ...scriptParams
  }: CreateRecordParameters<FieldData>) => {
    return this.session.request<
      FileMakerDataAPICreateRecordResponse,
      FileMakerDataAPICreateRecordRequest<FieldData>
    >(`/layouts/${layout}/records`, 'POST', {
      fieldData,
      ...(scriptParams ? this.parseScriptRequest(scriptParams) : {})
    })
  }

  editRecord = async <
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >({
    layout,
    recordId,
    fieldData,
    portalData,
    deleteRelated,
    ...scriptParams
  }: EditRecordParameters<FieldData, PortalData>) => {
    return this.session.request<FileMakerDataAPIEditRecordResponse>(
      `/layouts/${layout}/records/${recordId}`,
      'PATCH',
      {
        fieldData,
        portalData,
        deleteRelated,
        ...(scriptParams ? this.parseScriptRequest(scriptParams) : {})
      }
    )
  }

  duplicateRecord = async ({
    layout,
    recordId,
    ...scriptParams
  }: DuplicateRecordParameters) => {
    return this.session.request<
      FileMakerDataAPIDuplicateRecordResponse,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records/${recordId}`, 'POST', {
      ...(scriptParams ? this.parseScriptRequest(scriptParams) : {})
    })
  }

  deleteRecord = async ({
    layout,
    recordId,
    ...scriptParams
  }: DeleteRecordParameters) => {
    const urlParams = new URLSearchParams(
      scriptParams ? this.parseScriptRequest(scriptParams) : {}
    )
    return this.session.request<
      FileMakerDataAPIResponse,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records/${recordId}/?${urlParams}`, 'DELETE')
  }

  getRecord = async <
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >({
    layout,
    recordId,
    layoutResponse,
    portals = [],
    ...scriptParams
  }: GetRecordParameters) => {
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
    const queryString = new URLSearchParams({
      ...cleanedQuery,
      ...(scriptParams ? this.parseScriptRequest(scriptParams) : {})
    }).toString()

    // Make the request to the FileMaker Data API.
    return this.session.request<
      FileMakerDataAPIGetRecordResponse<FieldData, PortalData>,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records/${recordId}?${queryString}`, 'GET')
  }

  getRecordRange = async <
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >({
    layout,
    startingIndex,
    limit,
    layoutResponse,
    portals = [],
    sort = [],
    ...scriptParams
  }: GetRecordRangeParameters) => {
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
      _offset: startingIndex?.toString(),
      _limit: limit?.toString(),
      _sort: sort.length === 0 ? undefined : sort.toString()
    }

    // Remove any undefined values from the query object.
    const cleanedQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    )

    // Convert the query object to a query string.
    const queryString = new URLSearchParams({
      ...cleanedQuery,
      ...(scriptParams ? this.parseScriptRequest(scriptParams) : {})
    }).toString()

    // Make the request to the FileMaker Data API.
    return this.session.request<
      FileMakerDataAPIGetRecordResponse<FieldData, PortalData>,
      FileMakerDataAPIRequest
    >(`/layouts/${layout}/records?${queryString}`, 'GET')
  }

  /**
   * @throws {FileMakerDataAPIOperationException} If no records are found.
   */
  find = async <
    FieldData extends
      FileMakerDataAPIRecord['fieldData'] = FileMakerDataAPIRecord['fieldData'],
    PortalData extends
      FileMakerDataAPIRecord['portalData'] = FileMakerDataAPIRecord['portalData']
  >({
    layout,
    query,
    sort,
    limit = 100,
    portals,
    layoutResponse,
    ...scriptParams
  }: FindParameters<FieldData>) => {
    return this.session.request<
      FileMakerDataAPIGetRecordResponse<FieldData, PortalData>,
      FileMakerDataAPIFindRequest<FieldData>
    >(`/layouts/${layout}/_find`, 'POST', {
      query: query.map((parameters) => {
        return {
          ...parameters,
          omit: parameters.omit ? 'true' : undefined
        }
      }),
      limit: limit.toString(),
      sort,
      'layout.response': layoutResponse,
      ...portals?.reduce((acc, { name, limit, offset }) => {
        acc[`offset.${name}`] = offset.toString()
        acc[`limit.${name}`] = limit.toString()
        return acc
      }, {} as FileMakerDataAPIFindRequest<FieldData>),
      ...(scriptParams ? this.parseScriptRequest(scriptParams) : {})
    })
  }

  runScript = async ({
    layout,
    scriptName,
    scriptParameter
  }: RunScriptParameters) => {
    const urlScriptParameter = scriptParameter
      ? new URLSearchParams({
          'script.param': scriptParameter
        })
      : ''
    return this.session.request<FileMakerDataAPIRunScriptResponse>(
      `/layouts/${layout}/script/${encodeURIComponent(scriptName)}?${urlScriptParameter}`,
      'GET'
    )
  }
}
