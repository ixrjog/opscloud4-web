#npm i
npm run build:prod


# cp to opscloud-jar resource
# rm -rf /Users/liangjian/Documents/workspace/baiyi/opscloud4/opscloud-manage/src/main/resources/static/*
# mv ./dist/* /Users/liangjian/Documents/workspace/baiyi/opscloud4/opscloud-manage/src/main/resources/static/

# deploy to OSS
ossutil -c ~/.ossutilconfig cp -f -u --recursive ./dist/ oss://opscloud4-web-hz/prod/
