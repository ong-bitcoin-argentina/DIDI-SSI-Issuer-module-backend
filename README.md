# DIDI-SSI-Issuer-module

The issuer allows different entities authorized by didi-server to generate and emit certificates that can be accessed by their owners from didi. This module is made up of the issuer-front, a front-end developed in React, and the issuer-back, a backend developed in nodejs with a mongodb database. Where the information of certificate models and certificates to be issued is stored.

# Pre-requisites

- Install [Node.js](https://nodejs.org/en/) version 12.22.8

# Environment vars

This project uses the following environment variables:

| Name                          | Default Value | Mandatory |
| ----------------------------- | :-----------: | :-------: |
| NAME                          |               |     ✔     |
| VERSION                       |               |     ✔     |
| ENVIRONMENT                   |               |     ✔     |
| DEBUGG_MODE                   |     false     |    ❌     |
| ENABLE_INSECURE_ENDPOINTS     |     false     |    ❌     |
| ISSUER_API_URL                |               |     ✔     |
| ADDRESS                       |               |     ✔     |
| PORT                          |               |     ✔     |
| FULL_URL                      |               |     ✔     |
| RSA_PRIVATE_KEY               |               |     ✔     |
| HASH_SALT                     |               |     ✔     |
| DIDI_API                      |               |     ✔     |
| BLOCK_CHAIN_DELEGATE_DURATION |    1300000    |    ❌     |
| BLOCK_CHAIN_SET_ATTRIBUTE     |   999999999   |    ❌     |
| GAS_INCREMENT                 |      1.1      |    ❌     |
| BLOCKCHAIN_URL_RSK            |               |     ✔     |
| BLOCKCHAIN_URL_LAC            |               |     ✔     |
| BLOCKCHAIN_URL_BFA            |               |     ✔     |
| INFURA_KEY                    |               |     ✔     |
| MONGO_URI                     |               |     ✔     |
| ISSUER_SERVER_DID             |               |     ✔     |
| ISSUER_SERVER_PRIVATE_KEY     |               |     ✔     |
| DIDI_SERVER_DID               |               |     ✔     |
| DISABLE_TELEMETRY_CLIENT      |     false     |    ❌     |
| APP_INSIGTHS_IKEY             |               |     ✔     |

# Getting started

- Install dependencies

```
npm install
```

- Build and run the project

```
npm run start
```

## Project Structure

```
📦src
 ┣ 📂__tests__
 ┣ 📂.github
 ┣ 📂constants
 ┣ 📂controlles
 ┣ 📂coverage
 ┣ 📂docker-compose
 ┣ 📂models
 ┣ 📂policies
 ┣ 📂public
 ┣ 📂routes
 ┣ 📂services
 ┗📜server.js
```

## Project Endpoints

### [Swagger](https://api.issuer.alpha.didi.org.ar/api-docs/)

For more information, see the [documentation](https://docs.didi.org.ar/docs/developers/solucion/descripcion-tecnica/arquitectura-issuer)
