const algosdk = require('algosdk')
const fs = require("fs");
const child_process = require('child_process');

// algod
const server = process.env.URL;
const port = process.env.ALGOD_PORT;
const token = process.env.ALGOD_TOKEN

// Instantiate the algodv2 wrapper
let algodClient = new algosdk.Algodv2(token, server, port);

// Accounts from .env
const account1Mnemonic = process.env.ACCOUNT_1
const account2Mnemonic = process.env.ACCOUNT_2

const onCompleteOptions = {
  NO_OP: 0,
  OPT_IN: 1,
  CLOSE_OUT: 2,
  CLEAR_STATE: 3,
  UPDATE_APPLICATION: 4,
  DELETE_APPLICATION: 5
}

const appOptInTxn = async (txn) => {
  txn.suggestedParams = await algodClient.getTransactionParams().do();
  res = await algodClient.makeApplicationOptInTxnFromObject(txn);
  return res
}

const assetTransferTxn = async (txn) => {
  res = await algodClient.makeAssetTransferTxnWithSuggestedParamsFromObject(txn);
  return res
}

const noOpTxn = async (txn) => {
  txn.suggestedParams = await algodClient.getTransactionParams().do();
  res = await algodClient.makeApplicationCallTxnFromObject(txn);
  return res
}

const assembleTxnGroup = async (group) => {
  const txns = group.map(async txn => {
    switch (txn.type) {
      case "appl-optin":
        return await appOptInTxn(txn.txnObject);
      case "axfer":
        return await assetTransferTxn(txn);
      default:
        break;
    }
  })
  let txgroup = algodClient.assignGroupID(txns);
  // sign transactions

}

// const createAppTxn = async ({ from, suggestedParams, onComplete, approvalProgram, clearProgram, appData, args}) => {
//   const txn = await algosdk.makeApplicationCreateTxn(from, suggestedParams, onComplete, approvalProgram, clearProgram, appData.numLocalInts, appData.numLocalByteSlices, appData.numGlobalInts, appData.numGlobalByteSlices, args);
//   txn.fee = appData.txnParams ? appData.txnParams.fee ? appData.txnParams.fee : txn.fee : txn.fee
//   // const encodedTxn = algosdk.encodeUnsignedTransaction( txn )
//   return txn
// }

const signAndSubmitTxn = async (txn, creatorAccount, dryrun) => {
  // Sign the transaction
  const signedTxn = txn.signTxn(creatorAccount.sk)
  const txId = txn.txID().toString()
  console.log(`Signed transaction with txID: ${txId}`)
  if (dryrun) {
    const decodedTxn = await algosdk.decodeSignedTransaction(signedTxn)
    const dr =  await algosdk.createDryrun({
      client: algodClient,
      txns: [decodedTxn]
    })
    console.log(dr)
    return dr
  }
  // Submit the transaction
  await algodClient.sendRawTransaction(signedTxn).do();
  // Wait for transaction to be confirmed
  confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
  //Get the completed Transaction
  console.log(`Transaction ${txId} confirmed in round ${confirmedTxn["confirmed-round"]}`);
  // display results
  let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
  let appId = transactionResponse['application-index'];
  return appId
}

const callApp = async ({ appId, appArgs, onComplete, dryrun }) => {
  const account = algosdk.mnemonicToSecretKey(account1Mnemonic)
  const options = {
    'appIndex': parseInt(appId),
    'appArgs': appArgs,
    'from': account.addr,
    'OnComplete': onCompleteOptions[onComplete]
  }
  if (appArgs) {
    const argsArr = appArgs.slice(1,-1).split(",")
    options['appArgs'] = argsArr.map(a => {
      const splittedArg = a.split(":")
      const res = splittedArg[0] === 'str' ? splittedArg[1]
      : parseInt(splittedArg[1])
      return algosdk.encodeObj(res)
    })
  }
  options.suggestedParams = await algodClient.getTransactionParams().do();
  const txn = await algosdk.makeApplicationCallTxnFromObject(options)
  return await signAndSubmitTxn(txn, account, dryrun)
}

const setAccountsForTxn = (txn) => {
  const account1 = algosdk.mnemonicToSecretKey(account1Mnemonic)
  const account2 = algosdk.mnemonicToSecretKey(account2Mnemonic)
  let fromAcct
  let toAcct
  if (txn.from === 'account1') {
    fromAcct = account1
  } else if (txn.from === 'account2') {
    fromAcct = account2
  }
  if (txn.to === 'account1') {
    toAcct = account1
  } else if (txn.to === 'account2') {
    toAcct = account2
  }
  return {fromAcct, toAcct}
}

const encodeAppArgs = async (args) => {
  return args.map(arg => algosdk.encodeObj(arg))
}

const txnConstructor = async (txn) => {
  const txnBody = txn.txnObject
  const accts = await setAccountsForTxn(txnBody)
  // Setup addresses
  if (txnBody.from !== undefined) txnBody.from = accts.fromAcct.addr
  if (txnBody.to !== undefined) txnBody.to = accts.toAcct.addr
  // Setup args as Uint8Array
  if (txnBody.appArgs !== undefined) {
    const encodedAppArgs = await encodeAppArgs(txnBody.appArgs)
    txnBody.appArgs = encodedAppArgs
  }
  if (txnBody.note !== undefined) {
    const encodedNote = await algosdk.encodeObj(txnBody.note)
    txnBody.note = encodedNote
  }
  // Create signer object
  const signer = algosdk.makeBasicAccountTransactionSigner(accts.fromAcct)
  // Get suggested params from the client
  const sp = await algodClient.getTransactionParams().do()
  
  // Create a transaction
  const ptxn = new algosdk.Transaction({...txnBody, ...sp})
  console.log(ptxn)
}

const callTxnGroup = async (transactionsFileName) => {
  // retrieve content from json file
  const txns = require(`../transactions/${transactionsFileName}.json`).txns
  for (let index = 0; index < txns.length; index++) {
    const txn = txns[index]
    const constructedTxn = await txnConstructor(txn)

// // Construct TransactionWithSigner
// const tws = {txn: ptxn, signer: signer}

// // Pass TransactionWithSigner to ATC
// atc.addTransaction(tws)

}
}

module.exports = {
  // createTxnGroup,
  noOpTxn,
  callApp,
  callTxnGroup
}