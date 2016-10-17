#!/bin/bash

project_root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fusor_config_dir=$project_root/config/fusor

if ! [ -z "$MOCKS_ENABLED" ]; then
  echo "Building to target mocked environment..."
  ln -sf $fusor_config_dir/mocked.js $fusor_config_dir/config.js
elif ! [ -z "$LOCAL" ]; then
  echo "Building to target local environment..."
  ln -sf $fusor_config_dir/local.js $fusor_config_dir/config.js
else
  echo "Building to target vagrant environment..."
  ln -sf $fusor_config_dir/vagrant.js $fusor_config_dir/config.js
fi

node $project_root/dev_srv.js
