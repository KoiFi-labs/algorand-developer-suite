require('dotenv').config();
const child_process = require('child_process');

const sandboxUp = async () => {
  try {
    const stdout = child_process.execFileSync(`${process.env.LOCAL_SANDBOX_PATH}sandbox`, ["up", "-v"], {stdio: 'inherit'});
    // child_process.execFileSync(`${process.env.LOCAL_SANDBOX_PATH}sandbox`, ["goal", "-d", "/opt/testnetwork/Primary", "-t", "3", "kmd", "start"], {stdio: 'inherit'});
  } catch (err) {
     console.error(err);
  };
};

const sandboxDown = async () => {
  try {
    const stdout = await child_process.execFileSync(`${process.env.LOCAL_SANDBOX_PATH}sandbox`, ["down"], {stdio: 'inherit'});
  } catch (err) {
     console.error(err);
  };
};

const deleteContainers = async () => {
  try {
    const stdout = await child_process.execFileSync("docker-compose", ["-f", `${process.env.LOCAL_SANDBOX_PATH}docker-compose.yml`, "rm", "--force", "algod", "indexer", "indexer-db"], {stdio: 'inherit'});
  } catch (err) {
     console.error(err);
  };
};

const sandboxCreateApp = async (appName, creatorAddress, approvalProgram, clearProgram, globalByteSlices, globalInts, localByteSlices, localInts) => {
  try {
    const stdout = await child_process.execFileSync(`${process.env.LOCAL_SANDBOX_PATH}sandbox`, [
      "goal", 
      "app", 
      "create", 
      "--creator", 
      creatorAddress, 
      "--approval-prog",
      approvalProgram,
      "--clear-prog",
      clearProgram,
      "--global-byteslices",
      globalByteSlices,
      "--global-ints",
      globalInts,
      "--local-byteslices",
      localByteSlices,
      "--local-ints",
      localInts
    ], {stdio: 'inherit','cwd': `apps/${appName}`});
  } catch (err) {
     console.error(err);
  };
};

const startNetwork = async () => {
  console.log('Starting sandbox environment...');
  await sandboxUp();
}

const stopNetwork = async () => {
  console.log('Tearing down sandbox environment...');
  await sandboxDown();
  console.log('Deleting containers...');
  await deleteContainers();
  console.log('Network down and containers destroyed.')
}

const createApp = async (params) => {
  await sandboxCreateApp(params.appName, params.creatorAddress, params.approvalProgram, params.clearProgram, params.globalByteSlices, params.globalInts, params.localByteSlices, params.localInts);
}

module.exports = {
  startNetwork,
  stopNetwork,
  createApp
}
