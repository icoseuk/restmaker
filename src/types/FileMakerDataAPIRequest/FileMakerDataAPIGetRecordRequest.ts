type PortalName = string

/**
 * Represents a request to get a single record from the FileMaker Data API.
 */
type FileMakerDataAPIGetRecordQueryRequest = {
  portal?: PortalName
  'layout.response'?: string
  [key: `_offset.${PortalName}`]: string
  [key: `_limit.${PortalName}`]: string
}

export default FileMakerDataAPIGetRecordQueryRequest
