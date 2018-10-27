const fetch = require("node-fetch");
const fs = require('fs')

module.exports =  () => {
	const indexJson = {"index":["mem_201801_toyhouse"],"ignore_unavailable":true,"preference":1540435265076}
  const queryJson = {
		"version": true,
		"query": {
			"bool": {
				"must": [{
					"match_all": {}
				}, {
					"match_phrase": {
						"category": {
							"query": "Memscore"
						}
					}
				}, {
					"match_phrase": {
						"template": {
							"query": "Template:Memscore"
						}
					}
				}, {
					"range": {
						"timestamp": {
							"gte": 1514736000000,
							"lte": 1546271999999,
							"format": "epoch_millis"
						}
					}
				}],
				"must_not": []
			}
		},
		"size": 500,
		"sort": [{
			"timestamp": {
				"order": "desc",
				"unmapped_type": "boolean"
			}
		}],
		"_source": {
			"excludes": []
		},
		"aggs": {
			"2": {
				"date_histogram": {
					"field": "timestamp",
					"interval": "1w",
					"time_zone": "Asia/Shanghai",
					"min_doc_count": 1
				}
			}
		},
		"stored_fields": ["*"],
		"script_fields": {},
		"docvalue_fields": ["timestamp"],
		"highlight": {
			"pre_tags": ["@kibana-highlighted-field@"],
			"post_tags": ["@/kibana-highlighted-field@"],
			"fields": {
				"*": {
					"highlight_query": {
						"bool": {
							"must": [{
								"match_all": {}
							}, {
								"match_phrase": {
									"category": {
										"query": "Memscore"
									}
								}
							}, {
								"match_phrase": {
									"template": {
										"query": "Template:Memscore"
									}
								}
							}, {
								"range": {
									"timestamp": {
										"gte": 1514736000000,
										"lte": 1546271999999,
										"format": "epoch_millis"
									}
								}
							}],
							"must_not": []
						}
					}
				}
			},
			"fragment_size": 2147483647
		}
	}

  const queryStr = JSON.stringify(indexJson) + '\n' + JSON.stringify(queryJson) + '\n'
  return fetch("http://main.toyhouse.cc:5601/elasticsearch/_msearch", {
    credentials: "include",
    headers: {
        'kbn-xsrf':'kbn-version: 5.6.10'
    },
    referrer: "http://main.toyhouse.cc:5601/app/kibana",
    referrerPolicy: "no-referrer-when-downgrade",
    body: queryStr,
    method: "POST",
    mode: "cors",
  }).then(res => res.text())
  .then(data => {
  	const parsedData = JSON.parse(data).responses[0].hits.hits
  	return parsedData.map(item => {
  		return {
	  		_id: item._id,
	  		text: item._source.source_text,
	  		title: item._source.title,
	  		templateList: item._source.template,
	  		outgoing_link: item._source.outgoing_link,
	  		timestamp: item._source.timestamp,
	  	}
  	})
  })
  .catch(function(error) {
    console.log('error: ' + error);
  })
};

console.log('')


//日志抓取后格式如下
// [ { _index: 'mem_201801_toyhouse_general_first',
//     _type: 'page',
//     _id: '1722',
//     _version: 4,
//     _score: null,
//     _source:
//      { version: 29585,
//        wiki: 'mem_201801_toyhouse',
//        namespace: 2,
//        namespace_text: 'User',
//        title: 'Nixintian',
//        timestamp: '2018-10-25T05:31:12Z',
//        category: [Array],
//        external_link: [],
//        outgoing_link: [Array],
//        template: [Array],
//        text:
//         '倪新天 1991年10月10日 内蒙古 毕业于内蒙古大学 2010-2014年 内蒙古大学信息工程系2015年-至今 内蒙古巴彦淖尔市乌拉特后旗住房和城乡建设局 微信：nxt450052430 邮箱：450052430@qq.com   docker    导师：杨裕欣 Bob  个人简历 个人逻辑模型AssistantLM:倪新天  SAMPLE MEM课程自评打分  wiki作业的完成度：自评:15/总分:20 对课程内容的掌握情况：自评:12/总分:20 对班级生态的贡献：自评:8/总分:30',
//        source_text:
//         '[[File:nixintian.jpg|thumb|100px]]\n==个人介绍==\n*倪新天\n*1991年10月10日\n*内蒙古\n*毕业于内蒙古大学\n\n===经历===\n*2010-2014年 内蒙古大学信息工程系\n\n*2015年-至今 内蒙古巴彦淖尔市乌拉特后旗住房和城乡建设局\n\n===联系方式===\n微信：nxt450052430\n\n邮箱：450052430@qq.com\n\n===基础技能===\ndocker\n==MEM产出==\n===2018级MEM第二批次===\n 导师：杨裕欣 Bob\n\n*<strike>个人简历</strike>\n*个人逻辑模型[[AssistantLM:倪新天]]\n\n[[category:AssistantLM]]\n\n\nSAMPLE\n{{memscore|15|12|8}}\n[[category:memscore]]',
//        text_bytes: 576,
//        content_model: 'wikitext',
//        language: 'en',
//        heading: [Array],
//        opening_text: null,
//        auxiliary_text: [Array],
//        defaultsort: false,
//        redirect: [],
//        incoming_links: 2 },
//     fields: { 'text.word_count': [Array], timestamp: [Array] },
//     highlight: { template: [Array], category: [Array] },
//     sort: [ 1540445472000 ] },
//   { _index: 'mem_201801_toyhouse_general_first',
//     _type: 'page',
//     _id: '25',
//     _version: 20,
//     _score: null,
//     _source:
//      { version: 29584,
//        wiki: 'mem_201801_toyhouse',
//        namespace: 2,
//        namespace_text: 'User',
//        title: 'Bob.yuxinyang@gmail.com',
//        timestamp: '2018-10-25T02:22:36Z',
//        category: [Array],
//        external_link: [Array],
//        outgoing_link: [Array],
//        template: [Array],
//        text:
//         '@bobyuxinyang  18602109196课程团队产出汇报-杨裕欣(Bob) 20180902-MEM2018_第一期_助教 _技术    上海稻壳网络科技有限公司 产品研发总监稻壳网络   2006.9-2013.5 华中科技大学 软件工程 本科+硕士 2018年6-8月 清华紫荆谷第一期-第三期 课程技术支持 写代码 软件工程管理  个人简历 个人逻辑模型 MEM课程自评打分  wiki作业的完成度：自评:18/总分:20 对课程内容的掌握情况：自评:15/总分:20 对班级生态的贡献：自评:20/总分:30Bob.yuxinyang@gmail.com (talk) 09:21, 25 October 2018 (CST)   代码如下  {{memscore|18|15|20}} [[category:memscore]] ~~~~',
//        source_text:
//         '== 杨裕欣(Bob) ==\n\n[[File:yuxin.jpg|120px]]\n\n@bobyuxinyang\n\n* 18602109196\n\n[http://main.toyhouse.cc:81/杨裕欣-bob 课程团队产出汇报-杨裕欣(Bob) 20180902-MEM2018_第一期_助教 _技术 ]\n\n==\'\'\'所处公司\'\'\'==\n\n* 上海稻壳网络科技有限公司 产品研发总监\n[http://www.dookay.com 稻壳网络]\n\n==\'\'\'教育背景\'\'\'==\n\n* 2006.9-2013.5 华中科技大学 软件工程 本科+硕士\n\n==\'\'\'和XLP相关的项目经历\'\'\'==\n\n* 2018年6-8月 清华紫荆谷第一期-第三期 课程技术支持\n\n==\'\'\'擅长领域\'\'\'==\n\n* 写代码\n* 软件工程管理\n\n[[category:AssistantLM]]\n\n==\'\'\'MEM产出\'\'\'==\n===2018级MEM第二批次===\n*<strike>个人简历</strike>\n*<strike>个人逻辑模型</strike>\n\n==打分sample==\n\n{{memscore|18|15|20}}\n\n[[category:memscore]]\n\n[[User:Bob.yuxinyang@gmail.com|Bob.yuxinyang@gmail.com]] ([[User talk:Bob.yuxinyang@gmail.com|talk]]) 09:21, 25 October 2018 (CST)\n\n\n代码如下\n<pre>\n{{memscore|18|15|20}}\n[[category:memscore]]\n~~~~\n</pre>',
//        text_bytes: 995,
//        content_model: 'wikitext',
//        language: 'en',
//        heading: [Array],
//        opening_text: null,
//        auxiliary_text: [],
//        defaultsort: false,
//        redirect: [],
//        incoming_links: 22 },
//     fields: { 'text.word_count': [Array], timestamp: [Array] },
//     highlight: { template: [Array], category: [Array] },
//     sort: [ 1540434156000 ] } ]
