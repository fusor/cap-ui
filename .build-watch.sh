#!/bin/bash

project_root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cap_config_dir=$project_root/config/cap

ln -sf $cap_config_dir/vagrant.js $cap_config_dir/config.js
npm run __build:watch
