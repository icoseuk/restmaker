import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'
import FileMakerDataAPIRequest from './FileMakerDataAPIRequest'

type EditablePortalData = {
  /**
   * The portal row ID of the related record to be modified.
   */
  recordId: string
}

/**
 * The request data for creating a record in the FileMaker Data API.
 */
type FileMakerDataAPIEditRecordRequest<
  FieldData,
  PortalData extends EditablePortalData
> = FileMakerDataAPIRequest<{
  /**
   * The fields to set in the record.
   */
  fieldData: FileMakerDataAPIRecord<FieldData, PortalData>['fieldData']

  /**
   * The portal data to set in the record.
   */
  portalData?: FileMakerDataAPIRecord<FieldData, PortalData>['portalData']
}>

export default FileMakerDataAPIEditRecordRequest
