#!/bin/bash

project_root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fusor_config_dir=$project_root/config/fusor

ln -sf $fusor_config_dir/vagrant.js $fusor_config_dir/config.js
npm run __build
