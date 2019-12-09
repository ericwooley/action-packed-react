#!/usr/bin/env bash
if (( $EUID != 0 ));
  then echo "Please run as root" && exit 1;
fi
PLAYGROUND_DIR=$PWD/playground
umount $PLAYGROUND_DIR || exit 0;
