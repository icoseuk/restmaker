/// <reference types="vite/client" />
import { afterAll, expect, expectTypeOf, test } from 'vitest'
import { RestMaker } from '../src/index'
import ProductDetailsLayoutRecord from './layouts/ProductDetailsLayoutRecord'
import { createTestRecord } from './lib/helpers'
import { promises as fs } from 'fs'

const {
  VITE_RESTMAKER_VALIDATOR_USERNAME,
  VITE_RESTMAKER_VALIDATOR_PASSWORD,
  VITE_RESTMAKER_VALIDATOR_HOST,
  VITE_RESTMAKER_VALIDATOR_DATABASE
} = import.meta.env

/**
 * The FileMaker Data API session to use for testing.
 */
let client: RestMaker | null = new RestMaker({
  username: VITE_RESTMAKER_VALIDATOR_USERNAME,
  password: VITE_RESTMAKER_VALIDATOR_PASSWORD,
  host: VITE_RESTMAKER_VALIDATOR_HOST,
  database: VITE_RESTMAKER_VALIDATOR_DATABASE
})

/**
 * The record ID to use for testing.
 */
let testableRecordId: string

/**
 * The duplicated record ID to use for testing.
 */
let testableDuplicatedRecordId: string

test('creating a record', async () => {
  const request = await createTestRecord(client)
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
    } as ProductDetailsLayoutRecord
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

test('getting a record in a different layout response', async () => {
  const request = await client?.getRecord({
    layout: 'Product Details',
    recordId: testableRecordId,
    layoutResponse: 'Inventory List'
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data).toHaveLength(1)
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Name')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Availability')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Image')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Part Number')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Units on Hand')
  expect(Object.entries(request.data[0].fieldData).length).toBe(5)
})

test('getting a range of records', async () => {
  for (let i = 0; i < 10; i++) {
    await createTestRecord(client)
  }
  const request = await client?.getRecordRange({
    layout: 'Product Details',
    startingIndex: 1,
    limit: 5
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).toBe(5)
})

test('getting a range of records in a different layout response', async () => {
  for (let i = 0; i < 10; i++) {
    await createTestRecord(client)
  }
  const request = await client?.getRecordRange({
    layout: 'Product Details',
    layoutResponse: 'Inventory List',
    startingIndex: 1,
    limit: 5
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).toBe(5)
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Name')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Availability')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Image')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Part Number')
  expectTypeOf(request.data[0].fieldData).toHaveProperty('Units on Hand')
  expect(Object.entries(request.data[0].fieldData).length).toBe(5)
})

test('finding a range of records that exist', async () => {
  const request = await client?.find<ProductDetailsLayoutRecord>({
    layout: 'Product Details',
    query: [
      {
        Name: 'Test Product'
      },
      {
        'Model Year': 2023
      }
    ],
    sort: [
      {
        fieldName: 'Name',
        sortOrder: 'ascend'
      }
    ],
    limit: 5
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).greaterThan(1)
})

test('finding and sorting range of 5 records', async () => {
  const request = await client?.find<ProductDetailsLayoutRecord>({
    layout: 'Product Details',
    query: [
      {
        Name: 'Test Product'
      },
      {
        'Model Year': 2023
      }
    ],
    sort: [
      {
        fieldName: 'Name',
        sortOrder: 'ascend'
      }
    ],
    limit: 5
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).greaterThan(1)
  const names = request.data.map((record) => record.fieldData.Name)
  expect(names).toEqual(names.sort())
  expect(names.length).toBe(5)
})

test("finding a range of records that don't exist", async () => {
  await expect(
    async () =>
      await client?.find({
        layout: 'Product Details',
        query: [
          {
            'Model Year': 2023,
            omit: true
          }
        ],
        limit: 5
      })
  ).rejects.toThrow()
})

test('updating the container in a record', async () => {
  expect(async () => {
    const buffer = await fs.readFile(`${__dirname}/lib/sample.jpeg`)
    const file = new File([buffer], 'sample.jpeg', { type: 'image/jpg' })

    await client.updateContainerData({
      layout: 'Product Details',
      recordId: testableRecordId,
      fieldName: 'Imageads',
      file
    })
  }).not.toThrow()
})

afterAll(async () => {
  await client?.logOut()
})
