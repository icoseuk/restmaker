/**
 * Represents a record returned by the FileMaker Data API.
 */
type FileMakerDataAPIRecord<
  FieldData = Record<string, unknown>,
  PortalData = {
    [key: string]: Record<string, unknown>
  }
> = {
  /**
   * The record ID.
   */
  recordId: number

  /**
   * The record modification ID.
   */
  modId: number

  /**
   * The record's fields.
   */
  fieldData: FieldData

  /**
   * The portal data.
   */
  portalData: {
    [K in keyof PortalData]: Array<PortalData[K]>
  }
}

export default FileMakerDataAPIRecord
