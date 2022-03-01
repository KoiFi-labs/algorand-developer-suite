const algosdk = require("algosdk")
const dotenv = require("dotenv").config()
const axios = require("axios")

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

const createAccount = () => {
  // let account = algodClient.generateAccount();
  // console.log("Account Address: ", account.addr);
  // return account.addr
}

module.exports = {
  getAccount,
  listAccounts,
  createAccount
}