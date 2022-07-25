const algosdk = require('algosdk')
const fs = require("fs");
const child_process = require('child_process');

// algod
const server = process.env.URL;
const port = process.env.ALGOD_PORT;
const token = process.env.ALGOD_TOKEN

// Instantiate the algodv2 wrapper
let algodClient = new algosdk.Algodv2(token, server, port);

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

const callApp = async ({ appId, appArgs, from, onComplete }) => {
  // algo-sandbox goal app call --app-id 1 --app-arg "int:2" --from FC74Y37WKCR5M7NTCDQ5ZLWWPNVALI7NQVHBKR3NLPOVLJYDI4TNK3TQUQ
  // Create application call txn
  const options = {
    'appIndex': appId,
    'appArgs': appArgs,
    'from': from,
    'OnComplete': onCompleteOptions[onComplete]
  }
  if (appArgs) {
    const argsArr = appArgs.slice(1,-1).split(",")
    options['appArgs'] = argsArr.map(a => {
      const splittedArg = a.split(":")
      return splittedArg[0] === 'str' ? splittedArg[1]
      : parseInt(splittedArg[1])
    })
  }
  // const txn = await algodClient.makeApplicationCallTxnFromObject(options)
  // txn.suggestedParams = await algodClient.getTransactionParams().do();
  console.log(options)  
}

module.exports = {
  // createTxnGroup,
  noOpTxn,
  callApp
}