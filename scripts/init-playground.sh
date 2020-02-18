#!/usr/bin/env bash

yarn clean-pg;
mkdir playground || true;
pushd apr-cli
yarn link
popd
pushd create-apr
yarn link
popd
cd playground;
create-apr --dev;
