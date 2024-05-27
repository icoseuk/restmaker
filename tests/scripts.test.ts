/// <reference types="vite/client" />
import { expect, test } from 'vitest'
import { RestMaker } from '../src/index'
import {
  createTestRecord,
  createTestRecordWithScriptExecution
} from './lib/helpers'
import ProductDetailsLayoutRecord from './layouts/ProductDetailsLayoutRecord'

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

test('running a script with input and output', async () => {
  const request = await client?.runScript({
    layout: 'Product Details',
    scriptName: 'Testing Script',
    scriptParameter: 'Someone Cool'
  })
  expect(request).toBeDefined()
  expect(request.scriptError).toBe('0')
  expect(request.scriptResult).toBe('Hello Someone Cool!')
})

test('creating a record and running a script with the request', async () => {
  const request = await createTestRecordWithScriptExecution(client)
  expect(request.recordId).toBeDefined()
  testableRecordId = request.recordId
})

test('duplicating a record and running a script with the request', async () => {
  const request = await client?.duplicateRecord({
    layout: 'Product Details',
    recordId: testableRecordId,
    script: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    presortScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    prerequestScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    }
  })
  expect(request.recordId).toBeDefined()
  expect(request.scriptError).toBe('0')
  expect(request.scriptResult).toBe('Hello Someone Cool!')
  expect(request['scriptError.prerequest']).toBe('0')
  expect(request['scriptResult.prerequest']).toBe('Hello Someone Cool!')
  expect(request['scriptError.presort']).toBe('0')
  expect(request['scriptResult.presort']).toBe('Hello Someone Cool!')
  testableDuplicatedRecordId = request.recordId
})

test('editing a record and running a script with the request', async () => {
  const request = await client?.editRecord({
    layout: 'Product Details',
    recordId: testableRecordId,
    fieldData: {
      Name: 'Test Product (edited)'
    } as ProductDetailsLayoutRecord,
    script: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    presortScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    prerequestScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    }
  })
  expect(request.modId).toBeDefined()
  expect(request.scriptError).toBe('0')
  expect(request.scriptResult).toBe('Hello Someone Cool!')
  expect(request['scriptError.prerequest']).toBe('0')
  expect(request['scriptResult.prerequest']).toBe('Hello Someone Cool!')
  expect(request['scriptError.presort']).toBe('0')
  expect(request['scriptResult.presort']).toBe('Hello Someone Cool!')
})

test('deleting a record and running a script with the request', async () => {
  const request = await client?.deleteRecord({
    layout: 'Product Details',
    recordId: testableDuplicatedRecordId,
    script: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    presortScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    prerequestScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    }
  })
  expect(request).toBeDefined()
  expect(request.scriptError).toBe('0')
  expect(request.scriptResult).toBe('Hello Someone Cool!')
  expect(request['scriptError.prerequest']).toBe('0')
  expect(request['scriptResult.prerequest']).toBe('Hello Someone Cool!')
  expect(request['scriptError.presort']).toBe('0')
  expect(request['scriptResult.presort']).toBe('Hello Someone Cool!')
})

test('getting a record and running a script with the request', async () => {
  const request = await client?.getRecord({
    layout: 'Product Details',
    recordId: testableRecordId,
    script: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    presortScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    prerequestScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    }
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data).toHaveLength(1)
  expect(request.scriptError).toBe('0')
  expect(request.scriptResult).toBe('Hello Someone Cool!')
  expect(request['scriptError.prerequest']).toBe('0')
  expect(request['scriptResult.prerequest']).toBe('Hello Someone Cool!')
  expect(request['scriptError.presort']).toBe('0')
  expect(request['scriptResult.presort']).toBe('Hello Someone Cool!')
})

test('getting a range of records and running a script with the request', async () => {
  for (let i = 0; i < 10; i++) {
    await createTestRecord(client)
  }
  const request = await client?.getRecordRange({
    layout: 'Product Details',
    startingIndex: 1,
    limit: 5,
    script: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    presortScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    prerequestScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    }
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).toBe(5)
  expect(request.scriptError).toBe('0')
  expect(request.scriptResult).toBe('Hello Someone Cool!')
  expect(request['scriptError.prerequest']).toBe('0')
  expect(request['scriptResult.prerequest']).toBe('Hello Someone Cool!')
  expect(request['scriptError.presort']).toBe('0')
  expect(request['scriptResult.presort']).toBe('Hello Someone Cool!')
})

test('finding a range of records and running a script with the request', async () => {
  const request = await client?.find<ProductDetailsLayoutRecord>({
    layout: 'Product Details',
    query: [
      {
        Name: 'Test Product'
      }
    ],
    script: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    presortScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    },
    prerequestScript: {
      name: 'Testing Script',
      param: 'Someone Cool'
    }
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).greaterThan(1)
  expect(request.scriptError).toBe('0')
  expect(request.scriptResult).toBe('Hello Someone Cool!')
  expect(request['scriptError.prerequest']).toBe('0')
  expect(request['scriptResult.prerequest']).toBe('Hello Someone Cool!')
  expect(request['scriptError.presort']).toBe('0')
  expect(request['scriptResult.presort']).toBe('Hello Someone Cool!')
})
