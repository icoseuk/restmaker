import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'
import FileMakerDataAPIGetRecordResponse from './FileMakerDataAPIGetRecordResponse'

/**
 * Represents the response from the FileMaker Data API when finding records.
 */
type FileMakerDataAPIFindResponse<
  FieldData = FileMakerDataAPIRecord['fieldData'],
  PortalData = FileMakerDataAPIRecord['portalData']
> = FileMakerDataAPIGetRecordResponse<FieldData, PortalData>

export default FileMakerDataAPIFindResponse
