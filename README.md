# Neutrino OpenAPI starter

Simple starter project for REST APIs using Neutrino 9 and express-openapi.

## Design first API implementation:

* Describe API in api-doc.yml (Swagger/OpenAPI) 
* Implement operations as exported function in the api-v1/operations directory
* Link path to operations using `operationId` annotation in api-doc.yml

## Features

* Configuration with dotenv and node-convict
* API explorer with swagger-ui-express
  * http://localhost:3000/api/
  * http://localhost:3000/api/v1/api-doc
* Testing with jest and supertest

## Usage

Dev: `npm run start`

Test: `npm run test`

Build: `npm run build` - output in build directory

Debug: `npm run debug`

