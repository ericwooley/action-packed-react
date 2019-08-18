#!/usr/bin/env bash

mv playground/node_modules .node_modules.temp || true;
mv playground/yarn.lock .yarn.lock.temp || true;
rm -rf playground/* || true;
rm -rf playground/.* || true;
mv .node_modules.temp playground/node_modules || true;
mv .yarn.lock.temp playground/yarn.lock || true;
