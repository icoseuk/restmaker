/// <reference types="vite/client" />
import { expect, test } from 'vitest'
import { FileMakerDataAPIClient } from '../src/index'
import {
  createTestRecord,
  createTestRecordWithScriptExecution
} from './lib/helpers'

const {
  VITE_RESTMAKER_VALIDATOR_USERNAME,
  VITE_RESTMAKER_VALIDATOR_PASSWORD,
  VITE_RESTMAKER_VALIDATOR_HOST,
  VITE_RESTMAKER_VALIDATOR_DATABASE
} = import.meta.env

/**
 * The FileMaker Data API session to use for testing.
 */
let client: FileMakerDataAPIClient | null = new FileMakerDataAPIClient(
  VITE_RESTMAKER_VALIDATOR_USERNAME,
  VITE_RESTMAKER_VALIDATOR_PASSWORD,
  VITE_RESTMAKER_VALIDATOR_HOST,
  VITE_RESTMAKER_VALIDATOR_DATABASE
)

/**
 * The record ID to use for testing.
 */
let testableRecordId: string

/**
 * The duplicated record ID to use for testing.
 */
let testableDuplicatedRecordId: string

test('running a script with input and output', async () => {
  const request = await client?.runScript({
    layout: 'Product Details',
    scriptName: 'Testing Script',
    scriptParameter: 'Someone Cool'
  })
  expect(request).toBeDefined()
})

test('creating a record and execute a script', async () => {
  const request = await createTestRecordWithScriptExecution(client)
  expect(request.recordId).toBeDefined()
  testableRecordId = request.recordId
})
