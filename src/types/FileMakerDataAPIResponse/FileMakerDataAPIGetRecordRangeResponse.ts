import FileMakerDataAPIGetRecordResponse from './FileMakerDataAPIGetRecordResponse'

/**
 * Represents the response from the FileMaker Data API when getting a range of records.
 */
type FileMakerDataAPIGetRecordRangeResponse<
  FieldData = Record<string, unknown>,
  PortalData = Record<string, unknown>
> = FileMakerDataAPIGetRecordResponse<FieldData, PortalData>

export default FileMakerDataAPIGetRecordRangeResponse
