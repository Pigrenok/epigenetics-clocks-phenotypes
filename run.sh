#!/bin/env bash

docker run -v $PWD:/usr/share/nginx/html -p 8005:80 nginx:alpine