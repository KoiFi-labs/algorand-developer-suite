const usage = function() {
  const usageText = `
  algods helps you manage your local Algorand development environment.

  usage:

    $ algods <command>

  commands:

    startnet:       Uses Algorand's sandbox to create a new private network
    stopnet:        Stops sandbox environment and deletes docker containers
    getaccount:     Retrieves account info
    listaccounts:   Lists existing accounts in your private network
    createaccount:  Creates a new Algorand account in your private network TODO
    fundaccount:    Funds an existing Algorand account TODO
    createtoken:    Creates a new ASA in your private network TODO
    help:           Displays this help guide
  `

  console.log(usageText);
}

const createAccountUsage = () => {
  const usageText = `
  usage:

    $ createaccount <options>
  
  options:

    -a <address>    Returns account info for a given address
    -h              Displays this help guide
  `
  console.log(usageText)
}

module.exports = {
  usage,
  createAccountUsage
}