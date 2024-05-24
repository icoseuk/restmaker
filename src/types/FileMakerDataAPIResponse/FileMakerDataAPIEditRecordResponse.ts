import FileMakerDataAPIResponse from './FileMakerDataAPIResponse'

/**
 * The response when editing a record.
 */
type FileMakerDataAPIEditRecordResponse = FileMakerDataAPIResponse<{
  /**
   * The new modification ID of the edited record.
   */
  modId: string
}>

export default FileMakerDataAPIEditRecordResponse
