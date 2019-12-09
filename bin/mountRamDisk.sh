#!/usr/bin/env bash
if (( $EUID != 0 ));
  then echo "Please run as root" && exit 1;
fi
PLAYGROUND_DIR=$PWD/playground
mkdir -p $PLAYGROUND_DIR
mount -t tmpfs -o size=2048M tmpfs $PLAYGROUND_DIR
