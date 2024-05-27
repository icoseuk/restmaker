type PortalName = string

/**
 * Represents a request to get a single record from the FileMaker Data API.
 */
type FileMakerDataAPIFindRequest<FieldData> = {
  /**
   * The query to search for.
   */
  query: { omit?: 'true' | 'false' } & {
    /**
     * The field to search in.
     */
    [k in keyof FieldData]: FieldData[k]
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

  /**
   * The portals to include in the response.
   */
  portal?: PortalName[]

  /**
   * The maximum number of records to return.
   */
  limit?: string

  /**
   * The layout to return the response from.
   */
  'layout.response'?: string

  /**
   * The offset of a portal record range.
   */
  [key: `offset.${PortalName}`]: string

  /**
   * The limit of a portal record range.
   */
  [key: `limit.${PortalName}`]: string
}

export default FileMakerDataAPIFindRequest