# @skypilot/fauna-tools

[![npm stable](https://img.shields.io/npm/v/@skypilot/fauna-tools?label=stable)](https://www.npmjs.com/package/@skypilot/fauna-tools)
[![stable build](https://img.shields.io/github/workflow/status/skypilot-dev/fauna-tools/Stable%20release?label=stable%20build)]()
[![npm next](https://img.shields.io/npm/v/@skypilot/fauna-tools/next?label=next)](https://www.npmjs.com/package/@skypilot/fauna-tools)
[![next build](https://img.shields.io/github/workflow/status/skypilot-dev/fauna-tools/Prerelease?branch=next&label=next%20build)]()
[![license: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Scripts & utilities for working with FaunaDB

## How to use

`src/scripts/create-db-and-key.sh PARENT_DB_NAME NEW_DB_NAME`: Create a child database under
another database, create an admin key for using the new database, and save the key to
`~/.fauna-shell`

`src/scripts/delete-db-and-key.sh PARENT_DB_NAME DB_NAME KEY_ID`: Delete the database and delete
its associated key. Requires knowledge of `KEY_ID` (can be looked up in the console). 


`src/scripts/deploy.sh DB_NAME`: Upload `schema.graphql` to the specified database and implement
it. This erases any previous schema.

`src/scripts/migrate.sh DB_NAME`: Upload `schema.graphql` to the specified database and modify
it to match the new schema. 

