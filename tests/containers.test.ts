/// <reference types="vite/client" />
import { afterAll, expect, expectTypeOf, test } from 'vitest'
import { FileMakerDataAPIClient } from '../src/index'
import ProductDetailsLayoutRecord from './layouts/ProductDetailsLayoutRecord'
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
let client: FileMakerDataAPIClient | null = new FileMakerDataAPIClient(
  VITE_RESTMAKER_VALIDATOR_USERNAME,
  VITE_RESTMAKER_VALIDATOR_PASSWORD,
  VITE_RESTMAKER_VALIDATOR_HOST,
  VITE_RESTMAKER_VALIDATOR_DATABASE
)

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
