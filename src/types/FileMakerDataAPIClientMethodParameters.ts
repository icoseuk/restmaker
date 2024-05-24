import FileMakerDataAPIRecord from './FileMakerDataAPIRecord'

export type CreateRecordParameters<FieldData> = {
  /**
   * The layout to create the record in.
   */
  layout: string

  /**
   * The field data for the new record.
   */
  fieldData: FileMakerDataAPIRecord<FieldData>['fieldData']
}

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
  portalData?: PortalData

  /**
   * The related record to delete. The format is `portalName.portalRowId`.
   */
  deleteRelated?:
    | `${Extract<keyof PortalData, string>}.${number}`
    | Array<`${Extract<keyof PortalData, string>}.${number}`>
}

export type DuplicateRecordParameters = {
  /**
   * The layout to duplicate the record in.
   */
  layout: string

  /**
   * The ID of the record to duplicate.
   */
  recordId: string
}

export type DeleteRecordParameters = {
  /**
   * The layout to delete the record in.
   */
  layout: string

  /**
   * The ID of the record to delete.
   */
  recordId: string
}

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
}

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
}
