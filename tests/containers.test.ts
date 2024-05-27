/// <reference types="vite/client" />
import { expect, test } from 'vitest'
import { RestMaker } from '../src/index'
import { createTestRecord } from './lib/helpers'

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

test('updating the container in a record', async () => {
  const recordId = (await createTestRecord(client)).recordId
  expect(
    async () =>
      await client.updateContainerData({
        layout: 'Product Details',
        recordId,
        fieldName: 'Image',
        file: new File(
          [await (await fetch('./lib/sample.jpg')).blob()],
          'sample.webp',
          { type: 'image/webp' }
        )
      })
  ).not.toThrow()
})
