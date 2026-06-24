const { AffindaAPI, AffindaCredential } = require('@affinda/affinda');
require('dotenv').config();

const credential = new AffindaCredential(process.env.AFFINDA_API_KEY || '');
const client = new AffindaAPI(credential);

async function test() {
  try {
    const orgIdentifier = 'VigzYsmF';
    // The library might expect just the string ID
    const workspaces = await client.getAllWorkspaces(orgIdentifier);
    console.log('Workspaces:', workspaces);
  } catch (error) {
    console.error('Affinda test failed:', error.message || error);
  }
}
test();
