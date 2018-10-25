#!/bin/bash
# npm run build

daoUsername='bobyuxinyang'
daoPassword='3NzWxp[hKATfv'
repoName='mem_score_dashboard'

branch=$(git symbolic-ref --short -q HEAD)
date="$(date +%Y%m%d%H%M%S)"
image='daocloud.io/weimar/'${repoName}':'${branch//\//-}'-'${date}

docker login daocloud.io -p ${daoPassword} -u ${daoUsername}

docker build . -t ${image}

docker push ${image}
