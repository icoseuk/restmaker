import FileMakerDataAPIResponse from './FileMakerDataAPIResponse'

type FileMakerDataAPIDuplicateRecordResponse = FileMakerDataAPIResponse<{
  /**
   * The record ID of the newly duplicated record.
   */
  recordId: string

  /**
   * The modification ID of the newly duplicated record (initially 0).
   */
  modId: string
}>

export default FileMakerDataAPIDuplicateRecordResponse
