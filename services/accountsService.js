const { decodeObj, decodeUint64 } = require("algosdk");
const algosdk = require("algosdk")
const dotenv = require("dotenv").config()
const axios = require("axios")
const child_process = require('child_process');

// algod
const server = process.env.URL;
const port = process.env.ALGOD_PORT;
const token = process.env.ALGOD_TOKEN

// Instantiate the algodv2 wrapper
let algodClient = new algosdk.Algodv2(token, server, port);

// indexer
const indexerUrl = `${process.env.URL}:${process.env.INDEXER_PORT}`

const getAccount = async (address) => {
  try {
    if (address === undefined) throw "Missing address"
    const accountInfo = await algodClient.accountInformation(address).do();
    return { ok: true, msg: accountInfo }
  } catch (error) {
    return { ok: false, msg: error }
  }
}

const listAccounts = async () => {
  const path = `${indexerUrl}/v2/accounts`
  try {
    const res = await axios.get(path)
    return { ok: true, msg: res.data.accounts }
  } catch (error) {
    return { ok: false, msg: error }
  }
}

const createAccount = async () => {
  try {
    const account = await algosdk.generateAccount();
    console.log("New account created")
    // fund account with 5 algos
    try {
      const stdout = child_process.execFileSync(`${process.env.LOCAL_SANDBOX_PATH}sandbox`, ["goal", "clerk", "send", "-a", "5000000", "-f", "WKQL3QUKVSZZIJZS3FJJQOI5E57FX4P6MQW34KMXMUL7WVEWP7V26FEKUQ", "-t", account.addr ], {stdio: 'inherit'});
      console.log("New account funded with 5 algos")
    } catch (err) {
      console.log("Unable to fund new account. Please fund manually.")
    };
    return { ok: true, msg: {
      address: account.addr,
      mnemonic: algosdk.secretKeyToMnemonic(account.sk)
    }}
  } catch (error) {
    return { ok: false, msg: error }
  }
}

const fundAccount = async (receiverAccount, amt) => {
  try {
    if (amt > 5000000 || amt < 100000) throw "Max amount is 5,000,000 microalgos and min amount is 100,000 microalgos"
    const stdout = child_process.execFileSync(`${process.env.LOCAL_SANDBOX_PATH}sandbox`, ["goal", "clerk", "send", "-a", amt, "-f", "WKQL3QUKVSZZIJZS3FJJQOI5E57FX4P6MQW34KMXMUL7WVEWP7V26FEKUQ", "-t", receiverAccount ], {stdio: 'inherit'});
    return { 
      ok: true, 
      msg: `Account ${receiverAccount} succesfully funded with ${amt} microalgos`}
  } catch (err) {
    return { ok: false, msg: err }
  };
}

module.exports = {
  getAccount,
  listAccounts,
  createAccount,
  fundAccount
}