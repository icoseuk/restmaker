import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'
import FileMakerDataAPIGetRecordResponse from './FileMakerDataAPIGetRecordResponse'

/**
 * Represents the response from the FileMaker Data API when getting a range of records.
 */
type FileMakerDataAPIGetRecordRangeResponse<
  FieldData = FileMakerDataAPIRecord['fieldData'],
  PortalData = FileMakerDataAPIRecord['portalData']
> = FileMakerDataAPIGetRecordResponse<FieldData, PortalData>

export default FileMakerDataAPIGetRecordRangeResponse
