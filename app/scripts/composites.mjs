import { readFileSync } from 'fs';
import { CeramicClient } from '@ceramicnetwork/http-client'
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
} from "@composedb/devtools-node";

import { DID } from 'dids';
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";
import * as fs from 'fs';

const ceramic = new CeramicClient(process.env.CERAMIC_URI);
const definition_file = './src/__generated__/definition.json'

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async (spinner) => {
  await authenticate()

  try {
    if (fs.existsSync(definition_file)) {
      spinner.succeed("composite already deployed & ready for use");
    } else {
      spinner.info("writing composite to Ceramic")
      const composite = await createComposite(ceramic, './composites/basicProfile.graphql')
      await writeEncodedComposite(composite, definition_file);
      spinner.info('creating composite for runtime usage')
      await writeEncodedCompositeRuntime(
        ceramic,
        definition_file,
        "./src/__generated__/definition.js"
      );
      spinner.info('deploying composite')
      const deployComposite = await readEncodedComposite(ceramic, definition_file)
    
      await deployComposite.startIndexingOn(ceramic)
      spinner.succeed("composite deployed & ready for use");
    }
  } catch(err) {
    console.error(err)
  }
}

/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
  const seed = readFileSync('./admin_seed.txt')
  const key = fromString(
    seed,
    "base16"
  );
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key)
  })
  await did.authenticate()
  ceramic.did = did
}