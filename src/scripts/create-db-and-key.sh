#!/usr/bin/env bash

CONFIG_FILE_PATH=~/.fauna-shell

# Change to the directory of this script so that relative paths resolve correctly
cd "$(dirname $0)" || exit

showUsage () {
  echo "Usage: $0 PROJECT_CODE DB_NAME"
}

if [[ $1 == '--help' || $1 == '-h' || $1 == '-?' ]]; then
  showUsage;
  exit 0
fi

if [[ $# -ne 2 ]]; then
  showUsage;
  exit 1
fi

PROJECT_CODE=$1
DB_NAME=$2

ENDPOINT=${PROJECT_CODE}
ROLE='admin'

echo "Creating the database '${DB_NAME}' under the '${PROJECT_CODE}' database in the cloud ..."
if ! OUTPUT=$(
  npx fauna create-database "${DB_NAME}" \
    --endpoint ${ENDPOINT} \
); then
  echo "Error creating database." 1>&2
  exit 1
fi
echo "The database has been created. Manage at https://dashboard.fauna.com/db/${PROJECT_CODE}/${DB_NAME}."

echo -e "\nCreating an admin key for the database ..."
if ! OUTPUT=$(
  npx fauna create-key "${DB_NAME}" "${ROLE}" \
    --endpoint ${ENDPOINT} \
); then
  exit 1
fi

SECRET_KEY=$(echo "${OUTPUT}" | grep secret: | awk '{print $2}')

if [[ -z ${SECRET_KEY} ]]; then
  echo "Error parsing the secret key." 1>&2
  exit 1
fi
echo "The key has been created: ${SECRET_KEY}. Manage at https://dashboard.fauna.com/keys/@db/${PROJECT_CODE}."

echo -e "\nAdding the endpoint config & secret key for '${DB_NAME}' to the Fauna config file at ~/.fauna-shell ..."
if ! OUTPUT=$(
  npx fauna add-endpoint https://db.fauna.com \
    --alias="${DB_NAME}" \
    --key="${SECRET_KEY}" \
); then
  echo "Error adding the endpoint config." 1>&2
  exit 1
fi
echo "The endpoint config & secret key have been saved to the Fauna config file at '${CONFIG_FILE_PATH}'."
