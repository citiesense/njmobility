#!/bin/bash
#
# Uses eslint_d's network interface to lint js files.
#
# Arguments
#   $0 - this script
#   $1 - path of the assets folder. Default: './assets'
#   $2 - additional flags for eslint_d

set -e

PORT=`cat ~/.eslint_d | cut -d" " -f1`
TOKEN=`cat ~/.eslint_d | cut -d" " -f2`
DIRPATH=${1:-./assets}

FF=$(echo "$TOKEN $PWD ${2:-''} --quiet --cache $DIRPATH" | nc localhost $PORT)

if [[ -n "$FF" ]]; then
  echo "$FF"
  exit 1
fi
