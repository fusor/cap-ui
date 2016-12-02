#!/bin/bash

project_root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cap_config_dir=$project_root/config/cap

if ! [ -z "$MOCKS_ENABLED" ]; then
  echo "Building to target mocked environment..."
  ln -sf $cap_config_dir/mocked.js $cap_config_dir/config.js
elif ! [ -z "$LOCAL" ]; then
  echo "Building to target local environment..."
  ln -sf $cap_config_dir/local.js $cap_config_dir/config.js
else
  echo "Building to target vagrant environment..."
  ln -sf $cap_config_dir/vagrant.js $cap_config_dir/config.js
fi

#node $project_root/dev_srv.js
nodemon $project_root/dev_srv.js
