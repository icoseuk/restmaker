type PortalName = string

/**
 * Represents a request to get a range of records from the FileMaker Data API.
 */
type FileMakerDataAPIGetRecordRangeRequest = {
  portal?: PortalName
  'layout.response'?: string
  [key: `_offset.${PortalName}`]: string
  [key: `_limit.${PortalName}`]: string
  _limit?: string
  _offset?: string
  _sort?: string
}

export default FileMakerDataAPIGetRecordRangeRequest
