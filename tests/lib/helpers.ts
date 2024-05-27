import { FileMakerDataAPIClient } from '../../src'
import ProductDetailsLayoutRecord from '../layouts/ProductDetailsLayoutRecord'

/**
 * Creates a test record with the specified client.
 */
export const createTestRecord = async (client: FileMakerDataAPIClient) => {
  return await client.createRecord({
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
    } as ProductDetailsLayoutRecord
  })
}

export const createTestRecordWithScriptExecution = async (
  client: FileMakerDataAPIClient
) => {
  return await client.createRecord({
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
}
