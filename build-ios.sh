#! /bin/sh

read -p 'Enter Apple Password' password
export EXPO_APPLE_PASSWORD=$password

expo build:ios --apple-id rain.io.app@gmail.com

