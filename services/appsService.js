const accountsService = require('./accountsService')
const algosdk = require('algosdk')
const fs = require("fs");
const child_process = require('child_process');

// algod
const server = process.env.URL;
const port = process.env.ALGOD_PORT;
const token = process.env.ALGOD_TOKEN

// Instantiate the algodv2 wrapper
let algodClient = new algosdk.Algodv2(token, server, port);

const getBasicProgramBytes = async (client, stringTEALProgram) => {
  const compiledProgram = await client.compile(stringTEALProgram).do();
  return new Uint8Array(Buffer.from(compiledProgram.result, 'base64'));
}

const getClearStateCode = (appName) => {
  const buffer = fs.readFileSync(`apps/${appName}/clear.teal`);
  const clearStateCode = buffer.toString()
  return clearStateCode
}

const getAppData = (appName) => {
  const appData = require(`../apps/${appName}/${appName}.json`)
  return appData
}

const createAppTxn = async ({ from, suggestedParams, onComplete, approvalProgram, clearProgram, appData, args}) => {
  const txn = await algosdk.makeApplicationCreateTxn(from, suggestedParams, onComplete, approvalProgram, clearProgram, appData.numLocalInts, appData.numLocalByteSlices, appData.numGlobalInts, appData.numGlobalByteSlices, args);
  txn.fee = appData.txnParams ? appData.txnParams.fee ? appData.txnParams.fee : txn.fee : txn.fee
  // const encodedTxn = algosdk.encodeUnsignedTransaction( txn )
  return txn
}

const signAndSubmitTxn = async (txn, creatorAccount) => {
  // Sign the transaction
  const signedTxn = txn.signTxn(creatorAccount.sk)
  const txId = txn.txID().toString()
  console.log(`Signed transaction with txID: ${txId}`)
  console.log(signedTxn)
  // Submit the transaction
  // await algodClient.sendRawTransaction(signedTxn).do();
  // // Wait for transaction to be confirmed
  // confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
  // //Get the completed Transaction
  // console.log(`Transaction ${txId} confirmed in round ${confirmedTxn["confirmed-round"]}`);
  // // display results
  // let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
  // let appId = transactionResponse['application-index'];
  // return appId
}

const createApp = async (appName) => {
  console.log(`Creating ${appName} app...`)
  const account = await algosdk.generateAccount();
  // fund account
  child_process.execFileSync('utils/fundAccount.sh', {stdio: 'inherit'})
  const from = account.addr
  console.log(`From account: ${from}`)
  const onComplete = algosdk.OnApplicationComplete.NoOpOC;
  const buffer = fs.readFileSync(`apps/${appName}/${appName}.teal`);
  const programSource = buffer.toString();
  const approvalProgram = await getBasicProgramBytes(algodClient, programSource);
  const clearProgram = await getBasicProgramBytes(algodClient, getClearStateCode(appName));
  console.log(`Retrieving configuration params from ${appName}.json...`)
  const appData = getAppData(appName);
  const suggestedParams = Object.assign(await algodClient.getTransactionParams().do(), appData.txnParams);
  const args = appData.parameters.map(param => Number.isInteger(param)?algosdk.encodeUint64(param):algosdk.encodeObj(param))
  console.log('Creating transaction...')
  const txn = await createAppTxn({ from, suggestedParams, onComplete, approvalProgram, clearProgram, appData, args })
  const appId = await signAndSubmitTxn(txn, account)
  console.log(`App ${appName} was succesfully created!`)
  return { ok: true, msg: 'appId' }
}

module.exports = {
  createApp
}