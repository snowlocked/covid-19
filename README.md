# COVID-19

[Graph Page](https://snowlocked.github.io/covid-19/index.html#/)

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
# generate the json file of each country timeline data
node request/get-data.js

```

## Run & Build

```bash
# run in local
yarn serve
# build static html
yarn build
```

## Reference

- [丁香医生](https://ncov.dxy.cn/ncovh5/view/pneumonia?from=dxy)
- [数据可视化](https://github.com/Jannchie/Historical-ranking-data-visualization-based-on-d3.js)
- [数据仓库](https://github.com/BlankerL/DXY-COVID-19-Crawler)
