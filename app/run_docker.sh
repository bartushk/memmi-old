#!/bin/bash
#docker run -it --rm --name node_app -v "$PWD":/usr/src/myapp -w /usr/src/myapp node:0.10 node app.js

NODE_ARGS=""
START_SCRIPT=""
DOCKER_ARGS=""
while [[ $# > 0 ]]
do
  key="$1"

  case $key in
    -d|--debug)
      NODE_ARGS="$NODE_ARGS debug"
      echo "$NODE_ARGS"
      ;;
   -s|--script)
     START_SCRIPT=$2
     shift
     ;;

  esac
shift
done

if [ "$START_SCRIPT" == "" ]
then
  START_SCRIPT="app.js"
fi

if [ "$APP_NAME" == "" ]
then
  APP_NAME="node_app"
fi

if [ "$DOCKER_ARGS" == "" ]
then
  DOCKER_ARGS="-it --rm"
fi

COMMAND="docker run $DOCKER_ARGS  -p 3000:3000 -v $PWD:/usr/src/myapp -w /usr/src/myapp node node $NODE_ARGS $START_SCRIPT"
echo "Starting with command: $COMMAND"
$COMMAND
