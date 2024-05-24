/// <reference types="vite/client" />
import { afterAll, expect, test } from 'vitest'
import { FileMakerDataAPIClient } from '../src/index'
import InventoryItem from './types/InventoryItem'

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

/**
 * Creates a test record.
 */
const createTestRecord = async () => {
  return await client?.createRecord({
    layout: 'Product Details',
    fieldData: {
      Date: '01-01-2023',
      Category: 'Household',
      Name: 'Test Product',
      Manufacturer: 'Test Manufacturer',
      'Model Year': 2023,
      'Part Number': 'ABC123',
      'Bar Code': '1234567890',
      Description: 'A test product',
      Location: 'Warehouse',
      Taxable: 'Yes',
      'Unit Cost': '15.00',
      'Unit Price': '20.00',
      'Last Order': '01-01-2023',
      'Reorder Level': 1
    } as InventoryItem
  })
}

test('creating a record', async () => {
  const request = await createTestRecord()
  expect(request.recordId).toBeDefined()
  testableRecordId = request.recordId
})

test('duplicating a record', async () => {
  const request = await client?.duplicateRecord({
    layout: 'Product Details',
    recordId: testableRecordId
  })
  expect(request.recordId).toBeDefined()
  testableDuplicatedRecordId = request.recordId
})

test('editing a record', async () => {
  const request = await client?.editRecord({
    layout: 'Product Details',
    recordId: testableRecordId,
    fieldData: {
      Name: 'Test Product (edited)'
    } as InventoryItem
  })
  expect(request.modId).toBeDefined()
})

test('deleting a record', async () => {
  const request = await client?.deleteRecord({
    layout: 'Product Details',
    recordId: testableDuplicatedRecordId
  })
  expect(request).toStrictEqual({})
})

test('getting a record', async () => {
  const request = await client?.getRecord({
    layout: 'Product Details',
    recordId: testableRecordId
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data).toHaveLength(1)
})

test('getting a range of records', async () => {
  for (let i = 0; i < 10; i++) {
    await createTestRecord()
  }
  const request = await client?.getRecordRange({
    layout: 'Product Details',
    startingIndex: 1,
    limit: 5
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).toBe(5)
})

afterAll(async () => {
  await client?.logOut()
})
