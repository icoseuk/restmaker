/**
 * @file src/index.ts
 *
 * This file is the entry point for the module.
 */

// Export the client.
export { default as RestMaker } from './models/FileMakerDataAPIClient'

/**
 * Type Definitions
 */

// Export helper types.
export { default as FileMakerDataAPIHTTPCode } from './types/FileMakerDataAPIHTTPCode'
export { default as FileMakerDataAPIVersion } from './types/FileMakerDataAPIVersion'
export { default as FileMakerOperationStatus } from './types/FileMakerOperationStatus'

// Export response type definitions.
export { default as FileMakerDataAPIResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPIResponse'
export { default as FileMakerDataAPICreateRecordResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPICreateRecordResponse'
export { default as FileMakerDataAPIDuplicateRecordResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPIDuplicateRecordResponse'
export { default as FileMakerDataAPIEditRecordResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPIEditRecordResponse'
export { default as FileMakerDataAPIGetRecordResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPIGetRecordResponse'
export { default as FileMakerDataAPIFindResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPIFindResponse'
export { default as FileMakerDataAPIGetRecordRangeResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPIGetRecordRangeResponse'
export { default as FileMakerDataAPIRunScriptResponse } from './types/FileMakerDataAPIResponse/FileMakerDataAPIRunScriptResponse'

// Export client method type definitions.
export { RequestLifecycleScriptExecution as RequestLifecycleScriptExecution } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { CreateRecordParameters as CreateRecordParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { EditRecordParameters as EditRecordParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { DuplicateRecordParameters as DuplicateRecordParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { DeleteRecordParameters as DeleteRecordParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { GetRecordParameters as GetRecordParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { GetRecordRangeParameters as GetRecordRangeParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { FindParameters as FindParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { RunScriptParameters as RunScriptParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
export { UpdateContainerDataParameters as UpdateContainerDataParameters } from './types/FileMakerDataAPIClient/FileMakerDataAPIClientMethodParameters'
