# covid-19

## Project setup

``` bash
yarn
cd data
git init
git config core.sparsecheckout true
echo 'json/DXYArea-TimeSeries.json' >> .git/info/sparse-checkout
# if the speed of git pull is very slow, you can try this image repo.
# git remote add origin https://github.com.cnpmjs.org/BlankerL/DXY-COVID-19-Data.git
git remote add origin https://github.com/BlankerL/DXY-COVID-19-Data.git
git pull origin master
cd ..
# generate the json file of each country json url
node get-countires-url.js
# generate the json file of each country timeline data
node get-data.js
# generate the json file of timeline
node get-timeline
```
