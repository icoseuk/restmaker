import FileMakerDataAPIGetRecordResponse from './FileMakerDataAPIGetRecordResponse'

/**
 * Represents the response from the FileMaker Data API when finding records.
 */
type FileMakerDataAPIFindResponse<
  FieldData = Record<string, unknown>,
  PortalData = Record<string, unknown>
> = FileMakerDataAPIGetRecordResponse<FieldData, PortalData>

export default FileMakerDataAPIFindResponse
