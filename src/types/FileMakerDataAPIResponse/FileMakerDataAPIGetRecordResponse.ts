import FileMakerDataAPIRecord from '../FileMakerDataAPIRecord'

/**
 * Represents the response from the FileMaker Data API when getting records.
 */
type FileMakerDataAPIGetRecordResponse<
  FieldData = FileMakerDataAPIRecord['fieldData'],
  PortalData = FileMakerDataAPIRecord['portalData']
> = {
  data: FileMakerDataAPIRecord<FieldData, PortalData>[]
  dataInfo: {
    /**
     * The database the records are from.
     */
    database: string

    /**
     * The layout the records are from.
     */
    layout: string

    /**
     * The table the records are from.
     */
    table: string

    /**
     * The total number of records in the found set.
     */
    totalRecordCount: number

    /**
     * The number of records in the returned set.
     */
    foundCount: number

    /**
     * The number of records in the returned set.
     */
    returnedCount: number
  }
}

export default FileMakerDataAPIGetRecordResponse
