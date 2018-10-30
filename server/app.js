const Koa = require('koa');
const static = require('koa-static');
const path = require('path');
const app = new Koa();
var Router = require('koa-router');
var router = new Router();
const Papa = require("papaparse")
const fs = require('fs')

const getScores = require('./mem/lib/memscore');

//设置静态资源的路径
const staticPath = './dist';

app.use(static(path.join(__dirname, staticPath)));

router.get('/api/currentUser', (ctx, next) => {
  ctx.body = {
    name: 'xlp_senior',
  };
});

router.get('/api/getMemscoreList', async (ctx, next) => {
  ctx.body = await getScores();
});

router.get('/api/scores.csv', async (ctx, next) => {
	const scores = await getScores();
	const resultData = scores.map(item => {
		return [item['class'], item['name'], item['no'], item['email'], 'wait', item['score1'], item['score2'], item['status']]
	})

  const csvFile = fs.readFileSync(__dirname + '/mem/data/mem_wiki_scores.csv', 'utf8')
  const parseResult = Papa.parse(csvFile).data
  const result = []
  Object.keys(parseResult).forEach(key => {
    const item = parseResult[key]
    const no = item[0]
    const score = item[2]
    resultData.forEach(dataItem => {
    	if (dataItem[2] === no) {
    		dataItem[4] = score
    	}
    })
  })

	const data = {
		fields: ["班级", "名字", "学号", "邮箱", 'wiki作业完成度', '自评-课程内容掌握情况', '自评-对班级生态贡献', '自评状态'],
		data: resultData
	}  

	var csv = Papa.unparse(data);	
	ctx.type = 'application/octet-stream'
	ctx.body = csv
})

router.get('/dashboard/analysis', (ctx, next) => {
  ctx.redirect('/');
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('server is starting at port 3000');
});
