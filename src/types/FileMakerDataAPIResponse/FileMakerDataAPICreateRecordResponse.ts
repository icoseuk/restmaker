import FileMakerDataAPIResponse from './FileMakerDataAPIResponse'

type FileMakerDataAPICreateRecordResponse = FileMakerDataAPIResponse<{
  /**
   * The record ID of the newly created record.
   */
  recordId: string

  /**
   * The modification ID of the newly created record (initially 0).
   */
  modId: string
}>

export default FileMakerDataAPICreateRecordResponse
