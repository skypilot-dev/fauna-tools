#!/usr/bin/env bash

# Change to the directory of this script so that relative paths resolve correctly
cd $(dirname "$0")

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 DB_NAME"
  exit 1
fi

if [[ $1 == '--help' || $1 == '-h' || $1 == '-?' ]]; then
  echo "Usage: $0"
  exit 0
fi

DB_NAME=$1
./upload-schema.sh ${DB_NAME} --override
