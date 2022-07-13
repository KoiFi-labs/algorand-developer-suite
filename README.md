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
2. Add this project folder as bind volume in sandbox `docker-compose.yml` under key `services.algod`:
    ```yml
    volumes:
      - type: bind
        source: <path>
        target: /data
    ```
3. cd to /algorand-developer-suite
4. Create `.env` file following `.env.example`, make sure to set your local 
sandbox path correctly
5. Create `apps/` directory at root
6. Create `pyteal/contracts/` directory
7. run npm i to install dependencies
8. run ./algods, to verify it installed correctly the usage guide should display
9. Start developing on [Algorand](https://developer.algorand.org/)

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
    createaccount:  Creates a new Algorand account in your private network [TODO]
    fundaccount:    Funds an existing Algorand account [TODO]
    createtoken:    Creates a new ASA in your private network [TODO]
    build:          Compiles Approval and Clear program from pyteal code [TODO]
    createapp:      Issues a transaction that creates an application
    appinfo:        Displays App info [TODO]
    callapp:        Issues a transaction that calls an application [WIP]
    help:           Displays this help guide
```

## Contributing

Pull Requests are more than welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for more details. You can [create a new issue](https://github.com/luisdanielgp/algorand-development-suite/issues/new/choose) or give your [feedback](https://github.com/luisdanielgp/algorand-development-suite/discussions/new?category=Feedback).

## License

algorand-development-suite is licensed under an MIT license. See the [LICENSE](./LICENSE) file for details.