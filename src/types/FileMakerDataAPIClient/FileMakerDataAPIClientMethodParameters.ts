import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'

/**
 * The parameters for executing a script during the request lifecycle.
 */
export type RequestLifecycleScriptExecution = {
  /**
   * The script to be run after the action specified by the API call
   * (get, create, edit, duplicate, delete, find) and after the subsequent sort.
   */
  script?: {
    /**
     * The name of the script.
     */
    name: string

    /**
     * The single string parameter to pass to the script.
     */
    param?: string
  }
  /**
   * The script to be run before the action specified by the API call
   * (get, create, edit, duplicate, delete, find) and before the subsequent sort.
   */
  prerequestScript?: {
    /**
     * The name of the script.
     */
    name: string

    /**
     * The single string parameter to pass to the script.
     */
    param?: string
  }
  /**
   * The script to be run after the action specified by the API call
   * (get, create, edit, duplicate, delete, find) and before the subsequent sort.
   */
  presortScript?: {
    /**
     * The name of the script.
     */
    name: string

    /**
     * The single string parameter to pass to the script.
     */
    param?: string
  }
}

export type CreateRecordParameters<FieldData> = {
  /**
   * The layout to create the record in.
   */
  layout: string

  /**
   * The field data for the new record.
   */
  fieldData: FileMakerDataAPIRecord<FieldData>['fieldData']
} & RequestLifecycleScriptExecution

export type EditRecordParameters<
  FieldData extends FileMakerDataAPIRecord['fieldData'],
  PortalData extends FileMakerDataAPIRecord['portalData']
> = {
  /**
   * The layout to edit the record in.
   */
  layout: string

  /**
   * The ID of the record to edit.
   */
  recordId: string

  /**
   * The fields to set in the record.
   */
  fieldData: FieldData

  /**
   * The portal data to set in the record.
   */
  portalData?: Record<
    keyof PortalData,
    Array<PortalData[keyof PortalData] & { recordId: string; modId?: string }>
  >

  /**
   * The related record to delete. The format is `portalName.portalRowId`.
   */
  deleteRelated?:
    | `${Extract<keyof PortalData, string>}.${number}`
    | Array<`${Extract<keyof PortalData, string>}.${number}`>
} & RequestLifecycleScriptExecution

export type DuplicateRecordParameters = {
  /**
   * The layout to duplicate the record in.
   */
  layout: string

  /**
   * The ID of the record to duplicate.
   */
  recordId: string
} & RequestLifecycleScriptExecution

export type DeleteRecordParameters = {
  /**
   * The layout to delete the record in.
   */
  layout: string

  /**
   * The ID of the record to delete.
   */
  recordId: string
} & RequestLifecycleScriptExecution

export type GetRecordParameters = {
  /**
   * The layout to get the record from.
   */
  layout: string

  /**
   * The ID of the record to get.
   */
  recordId: string

  /**
   * The layout to return the response from.
   */
  layoutResponse?: string

  /**
   * The portals to include in the response.
   */
  portals?: {
    /**
     * The name of the portal.
     */
    name: string

    /**
     * The limit of the portal records.
     */
    limit: number

    /**
     * The offset of the portal records.
     */
    offset: number
  }[]
} & RequestLifecycleScriptExecution

export type GetRecordRangeParameters = {
  /**
   * The layout to get the record range from.
   */
  layout: string

  /**
   * The starting index of the record range.
   */
  startingIndex?: number

  /**
   * The limit of the record range.
   */
  limit?: number

  /**
   * The layout to return the response from.
   */
  layoutResponse?: string

  /**
   * The portals to include in the response.
   */
  portals?: {
    /**
     * The name of the portal.
     */
    name: string

    /**
     * The limit of the portal records.
     */
    limit: number

    /**
     * The offset of the portal records.
     */
    offset: number
  }[]

  /**
   * The sort order to use.
   */
  sort?: {
    /**
     * The field name to sort by.
     */
    fieldName: string

    /**
     * The sort order.
     */
    sortOrder: 'ascend' | 'descend'
  }[]
} & RequestLifecycleScriptExecution

export type FindParameters<FieldData extends Record<string, unknown>> = {
  /**
   * The layout to get the record range from.
   */
  layout: string

  /**
   * The query to search for.
   */
  query: { omit?: boolean } & {
    /**
     * The field to search in.
     */
    [k in keyof Partial<FieldData>]: FieldData[k]
  }[]

  /**
   * The limit of the record range.
   */
  limit?: number

  /**
   * The layout to return the response from.
   */
  layoutResponse?: string

  /**
   * The portals to include in the response.
   */
  portals?: {
    /**
     * The name of the portal.
     */
    name: string

    /**
     * The limit of the portal records.
     */
    limit: number

    /**
     * The offset of the portal records.
     */
    offset: number
  }[]

  /**
   * The sort order to use.
   */
  sort?: {
    /**
     * The field name to sort by.
     */
    fieldName: string

    /**
     * The sort order.
     */
    sortOrder: 'ascend' | 'descend'
  }[]
} & RequestLifecycleScriptExecution

export type RunScriptParameters = {
  /**
   * The layout to run the script in.
   */
  layout: string

  /**
   * The unique name of the script.
   */
  scriptName: string

  /**
   * The single string parameter to pass to the script.
   */
  scriptParameter?: string
}

export type UpdateContainerDataParameters = {
  /**
   * The layout to update the container data in.
   */
  layout: string

  /**
   * The record ID to update the container data for.
   */
  recordId: string

  /**
   * The field name to update the container data for.
   */
  fieldName: string

  /**
   * The file to upload.
   */
  file: File
}
