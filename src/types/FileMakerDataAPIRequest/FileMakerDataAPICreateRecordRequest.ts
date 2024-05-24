import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'
import FileMakerDataAPIRequest from './FileMakerDataAPIRequest'

/**
 * The request data for creating a record in the FileMaker Data API.
 */
type FileMakerDataAPICreateRecordRequest<FieldData> = FileMakerDataAPIRequest<{
  /**
   * The fields to set in the record.
   */
  fieldData: FileMakerDataAPIRecord<FieldData>['fieldData']
}>

export default FileMakerDataAPICreateRecordRequest
