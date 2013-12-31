#!/bin/bash

# Script to copy user uploads to an externally accessible server.
# Installation:
# 1. Copy to the elog server.
# 2. Set the user, host and directory variables below.
# 3. Add as a cron job to run daily at 7 am.

REMOTE_USER=
REMOTE_HOST=
SOURCE_DIR=
TARGET_DIR=
DAYS=7

for (( i=0; i<$DAYS; i++ ))
do
  DIR=$(date -d "$i days ago" +"%Y/%m/%d")
  INCLUDES="--include=$DIR/***${INCLUDES+ $INCLUDES}"
  if [ -z "$INCLUDE_START" ]
  then
    INCLUDE_START="--include=${DIR:0:4} --include=${DIR:0:7}"
  fi
done
INCLUDE_END="--include=${DIR:0:4} --include=${DIR:0:7}"

rsync -ra --delete-excluded $INCLUDE_START $INCLUDE_END $INCLUDES --exclude="*" $SOURCE_DIR $REMOTE_USER@$REMOTE_HOST:$TARGET_DIR
