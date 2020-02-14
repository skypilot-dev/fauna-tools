#!/usr/bin/env bash

CONFIG_FILE_PATH=~/.fauna-shell

# Change to the directory of this script so that relative paths resolve correctly
cd "$(dirname $0)" || exit

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 PROJECT_CODE DB_NAME KEY_ID"
  exit 0
fi

if [[ $1 == '--help' ]]; then
  echo "Usage: $0"
  exit 0
fi

PROJECT_CODE=$1
DB_NAME=$2
KEY_ID=$3

ENDPOINT=${PROJECT_CODE}

echo "Deleting the database '${DB_NAME}' under the '${PROJECT_CODE}' database in the cloud ..."
if ! npx fauna delete-database \
    --endpoint ${ENDPOINT} \
    "${DB_NAME}" \
; then
  echo "Error deleting database." 1>&2
  exit 1
fi
echo "The database has been deleted."

echo -e "\nDeleting the admin key for the database ..."
if ! npx fauna delete-key \
    --endpoint ${ENDPOINT} \
    "${KEY_ID}" \
; then
  echo "Error deleting the secret key '${KEY_ID}'." 1>&2
  echo "Manage keys at https://dashboard.fauna.com/keys/@db/${PROJECT_CODE}."
  exit 1
fi

# shellcheck disable=SC2103
echo -e "\nDeleting the endpoint config from the Fauna config file at ${CONFIG_FILE_PATH}"
# Switch to the project's root directory so that `tsconfig.json` can be found.
(
  cd ..
  babel-node --extensions .ts scripts/delete-endpoint-config.ts "${DB_NAME}" "${CONFIG_FILE_PATH}"
)
