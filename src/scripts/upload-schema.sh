#!/usr/bin/env bash

FAUNADB_ORIGIN=https://graphql.fauna.com
SCHEMA_FILE=schema.graphql

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 DB_NAME [--override]"
  exit 0
fi

if [[ $1 == '--help' ]]; then
  echo "Usage: $0"
  exit 0
fi

DB_NAME=$1

if [[ $2 == '--override' ]]; then
  ENDPOINT="${FAUNADB_ORIGIN}/import?mode=override"
else
  ENDPOINT="${FAUNADB_ORIGIN}/import"
fi

if [[ ! -e ${SCHEMA_FILE} ]]; then
  echo "Error: The schema file '${SCHEMA_FILE}' was not found." 1>&2
  exit 1
fi

# Look for a section named `[DB_NAME]` in the Fauna config file
if [[ $(grep -c "\[${DB_NAME}\]" ~/.fauna-shell) == '0' ]]; then
  echo "Error: The Fauna config file does not contain settings for a database named '${DB_NAME}'" 1>&2
  exit 1
fi

# Read the value for `secret` under the `[DB_NAME]` section
if ! KEY_SECRET=$(< ~/.fauna-shell grep -E "\[${DB_NAME}\]" -A 3 | grep secret | awk -F = '{print $2}'); then
  echo "Error retrieving the secret key from the Fauna config file." 1>&2
  exit 1
elif [[ -z ${KEY_SECRET} ]]; then
  echo "Error: The Fauna config file does not contain a secret key for the '${DB_NAME}' database" 1>&2
  exit 1
fi

echo "Uploading the schema '${SCHEMA_FILE}' to ${ENDPOINT} ..."
if ! curl \
  --data-binary "@${SCHEMA_FILE}" \
  --user "${KEY_SECRET}:" \
  "${ENDPOINT}" \
; then
  echo "Error: The schema could not be uploaded."
  exit 1
fi

echo -e "\nDone."
