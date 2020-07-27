#!/bin/bash
set -e

# https://www.freecodecamp.org/news/docker-entrypoint-cmd-dockerfile-best-practices-abc591c30e21/

cat /proc/sys/fs/inotify/max_user_watches

npm install
npm audit fix
expo login -u ${USERNAME} -p ${PASSWORD}
expo publish
