/// <reference types="vite/client" />
import { expect, onTestFinished, test } from 'vitest'
import { RestMaker } from '../src/index'

/**
 * The FileMaker Data API session to use for testing.
 */
let client: RestMaker | null = null

/**
 * The encryption key to use for testing.
 */
const tokenEncryptionKey =
  'RkvO31p5rxsU88lLcgrO4K0XcJelOyqnpJzEWJamuvyF01DApiFzJwAYiK8YO1Yl'

/**
 * The FileMaker Data API session to use for testing.
 */
let persistentClient: RestMaker | null = null

/**
 * The encrypted FileMaker Data API session token to use for testing.
 */
let persistentClientToken: string | null = null

test('checking the environment variables', () => {
  const {
    VITE_RESTMAKER_VALIDATOR_USERNAME,
    VITE_RESTMAKER_VALIDATOR_PASSWORD,
    VITE_RESTMAKER_VALIDATOR_HOST,
    VITE_RESTMAKER_VALIDATOR_DATABASE
  } = import.meta.env

  // This test will fail if the environment variables are not set.
  expect(VITE_RESTMAKER_VALIDATOR_USERNAME).toBeDefined()
  expect(VITE_RESTMAKER_VALIDATOR_PASSWORD).toBeDefined()
  expect(VITE_RESTMAKER_VALIDATOR_HOST).toBeDefined()
  expect(VITE_RESTMAKER_VALIDATOR_DATABASE).toBeDefined()

  /**
   * The FileMaker Data API session to use for testing.
   */
  client = new RestMaker({
    username: VITE_RESTMAKER_VALIDATOR_USERNAME,
    password: VITE_RESTMAKER_VALIDATOR_PASSWORD,
    host: VITE_RESTMAKER_VALIDATOR_HOST,
    database: VITE_RESTMAKER_VALIDATOR_DATABASE,
    profilingMode: true
  })

  persistentClient = new RestMaker({
    username: VITE_RESTMAKER_VALIDATOR_USERNAME,
    password: VITE_RESTMAKER_VALIDATOR_PASSWORD,
    host: VITE_RESTMAKER_VALIDATOR_HOST,
    database: VITE_RESTMAKER_VALIDATOR_DATABASE,
    persistentMode: {
      tokenEncryptionKey,
      existingEncryptedToken: null
    },
    profilingMode: true
  })
})

test('opening a new session with the FileMaker Data API', async () => {
  // This test will fail if the FileMaker Data API session cannot be created.
  expect(async () => await client?.logIn()).not.toThrow()

  // This test will fail if the FileMaker Data API session is not authenticated.
  onTestFinished(() => client?.logOut())
})

test('opening a new Persistent Mode session with the FileMaker Data API', async () => {
  // This test will fail if the FileMaker Data API session cannot be created.
  expect(async () => await persistentClient?.logIn()).not.toThrow()

  // This test will fail if the FileMaker Data API session is not authenticated.
  onTestFinished(() => persistentClient?.logOut())
})

test('retrieving an encrypted Persistent Mode session token', async () => {
  // Directly await the token() method.
  persistentClientToken = (await persistentClient?.token()) ?? null

  // Check that encryptedToken is defined and not null.
  expect(persistentClientToken).toBeDefined()
  expect(persistentClientToken).not.toBeNull()
})

test('getting a range of records using an existing token', async () => {
  // Create a new connection with the encrypted token.
  const newPersistentClient = new RestMaker({
    username: import.meta.env.VITE_RESTMAKER_VALIDATOR_USERNAME,
    password: import.meta.env.VITE_RESTMAKER_VALIDATOR_PASSWORD,
    host: import.meta.env.VITE_RESTMAKER_VALIDATOR_HOST,
    database: import.meta.env.VITE_RESTMAKER_VALIDATOR_DATABASE,
    persistentMode: {
      tokenEncryptionKey,
      existingEncryptedToken: persistentClientToken
    },
    profilingMode: true
  })

  const request = await newPersistentClient?.getRecordRange({
    layout: 'Product Details',
    layoutResponse: 'Inventory List',
    startingIndex: 1,
    limit: 5
  })
  expect(request.dataInfo).toBeDefined()
  expect(request.data.length).toBe(5)

  // This test will fail if the FileMaker Data API session is not authenticated.
  onTestFinished(() => newPersistentClient.logOut())
})
