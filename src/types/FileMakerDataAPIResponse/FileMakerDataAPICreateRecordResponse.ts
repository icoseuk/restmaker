/**
 * The response from the FileMaker Data API when creating a record.
 */
type FileMakerDataAPICreateRecordResponse = {
  /**
   * The record ID of the newly created record.
   */
  recordId: string

  /**
   * The modification ID of the newly created record (initially 0).
   */
  modId: string
}

export default FileMakerDataAPICreateRecordResponse
