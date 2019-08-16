#!/usr/bin/env bash

yarn clean-pg;
cd playground;
create-apr --dev;
yarn apr r;
yarn apr d;
