#!/usr/bin/env bash

mv playground/node_modules .node_modules.temp || true;
rm -rf playground/*;
mv .node_modules.temp playground/node_modules || true;
