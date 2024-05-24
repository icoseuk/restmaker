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

let testableRecordId: string
let testableDuplicatedRecordId: string

test('creating a record', async () => {
  const request = await client?.createRecord('Product Details', {
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
  } as InventoryItem)
  expect(request.recordId).toBeDefined()
  testableRecordId = request.recordId
})

test('duplicating a record', async () => {
  const request = await client?.duplicateRecord(
    'Product Details',
    testableRecordId
  )
  expect(request.recordId).toBeDefined()
  testableDuplicatedRecordId = request.recordId
})

test('editing a record', async () => {
  const request = await client?.editRecord(
    'Product Details',
    testableRecordId,
    {
      Name: 'Test Product (edited)'
    } as InventoryItem
  )
  expect(request.modId).toBeDefined()
})

test('deleting a record', async () => {
  const request = await client?.deleteRecord(
    'Product Details',
    testableDuplicatedRecordId
  )
  expect(request).toStrictEqual({})
})

afterAll(async () => {
  await client?.logOut()
})
