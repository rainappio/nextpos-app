#!/bin/bash
set -e

# https://www.freecodecamp.org/news/docker-entrypoint-cmd-dockerfile-best-practices-abc591c30e21/

npm install
expo login -u ${USERNAME} -p ${PASSWORD}
expo publish