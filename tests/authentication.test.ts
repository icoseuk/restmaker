/// <reference types="vite/client" />
import { expect, onTestFinished, test } from 'vitest'
import { FileMakerDataAPISession } from '../src/index'

/**
 * The FileMaker Data API session to use for testing.
 */
let session: FileMakerDataAPISession | null = null

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

  // Create the session here and use it in the next test
  session = new FileMakerDataAPISession(
    VITE_RESTMAKER_VALIDATOR_USERNAME,
    VITE_RESTMAKER_VALIDATOR_PASSWORD,
    VITE_RESTMAKER_VALIDATOR_HOST,
    VITE_RESTMAKER_VALIDATOR_DATABASE
  )
})

test('authenticating with the FileMaker Data API', async () => {
  // This test will fail if the FileMaker Data API session cannot be created.
  expect(async () => await session?.logIn()).not.toThrow()

  // This test will fail if the FileMaker Data API session is not authenticated.
  onTestFinished(() => session?.logOut())
})
