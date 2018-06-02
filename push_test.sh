echo "Please make sure you have pushed origin/dev, and on your local test branch now"
git reset --hard origin/dev
git reset --soft origin/test
git checkout HEAD -- .gitignore push_test.sh
yarn build
git add lib
git commit -m "`date '+%Y-%m-%d %H:%M:%S'`"
echo "Done, please push to remote"