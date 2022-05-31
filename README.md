# Algorand Development Suite

## Description

Local development environment for Algorand TEAL Smart Contracts.

## Requirements

+ An instance of Algorand's [Sandbox](https://github.com/algorand/sandbox) running on your machine.
You'll need Docker and Docker Compose, please refer to Sandbox repo's [README](https://github.com/algorand/sandbox#readme)
for installation instructions.
+ npm
+ Nodejs

## First steps

Assuming you allready have previous requirements and Docker is running in your machine:

1. Clone algorand-development-suite repo
2. cd to /algorand-developer-suite
3. Create `.env` file following `.env.example`, make sure to set your local 
sandbox path correctly
4. run npm i to install dependencies
5. run ./algods, to verify it installed correctly the usage guide should display
6. Start developing on [Algorand](https://developer.algorand.org/)

## Usage

```
  algods helps you manage your local Algorand development environment.

  usage:

    $ algods <command>

  commands:

    startnet:       Uses Algorand's sandbox to create a new private network
    stopnet:        Stops sandbox environment and deletes docker containers
    getaccount:     Retrieves account info
    listaccounts:   Lists existing accounts in your private network
    createaccount:  Creates a new Algorand account in your private network
    fundaccount:    Funds an existing Algorand account
    createtoken:    Creates a new ASA in your private network
    createapp:      Issues a transaction that creates an application
    callapp:        Issues a transaction that calls an application
    help:           Displays this help guide
```

## Contributing

Pull Requests are more than welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for more details. You can [create a new issue](https://github.com/luisdanielgp/algorand-development-suite/issues/new/choose) or give your [feedback](https://github.com/luisdanielgp/algorand-development-suite/discussions/new?category=Feedback).

## License

algorand-development-suite is licensed under an MIT license. See the [LICENSE](./LICENSE) file for details.