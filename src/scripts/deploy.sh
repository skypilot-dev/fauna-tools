#!/usr/bin/env bash

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 DB_NAME"
  exit 1
fi

if [[ $1 == '--help' || $1 == '-h' || $1 == '-?' ]]; then
  echo "Usage: $0"
  exit 0
fi

DB_NAME=$1

# This must be launched by a package manager that sets the `npm_config_user_agent` env var
PACKAGE_MANAGER=$(echo "${npm_config_user_agent}" | awk -F '/' '{print $1}')
COMMAND="fauna-upload-schema ${DB} --override"

case $PACKAGE_MANAGER in
  "npm") npx --no-install "${COMMAND}";;
  "pnpm") pnpx --no-install "${COMMAND}";;
  "yarn") yarn --silent "${COMMAND}";;
  "*") echo "Unknown package mananger '${PACKAGE_MANAGER}'" ; exit 1;;
esac
