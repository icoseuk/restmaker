/**
 * A generic response from the FileMaker Data API.
 *
 * @template FileMakerDataAPIRequestData  The type of the nested request object.
 */
type FileMakerDataAPIRequest<
  FileMakerDataAPIRequestData = Record<string, unknown>
> = FileMakerDataAPIRequestData & {
  /**
   * The name of the script to be run after the action specified by the API call
   * (get, create, edit, duplicate, delete, find) and after the subsequent sort.
   */
  script?: string

  /**
   * The text string to use as a parameter for the script that was named by script.
   */
  'script.param'?: string

  /**
   * The name of the script to be run before the action specified by the API call
   * and the subsequent sort.
   */
  'script.prerequest'?: string

  /**
   * The text string to use as a parameter for the script that was named by
   * script.prerequest.
   */
  'script.prerequest.param'?: string

  /**
   * The name of the script to be run after the action specified by the API call
   * but before the subsequent sort.
   */
  'script.presort'?: string

  /**
   * The text string to use as a parameter for the script that was named by
   * script.presort.
   */
  'script.presort.param'?: string
}

export default FileMakerDataAPIRequest
