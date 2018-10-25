const fetch = require("node-fetch");
const fs = require('fs')

module.exports =  (title) => {
  return fetch("http://main.toyhouse.cc:5601/elasticsearch/_msearch", {
    credentials: "include",
    headers: {
        'kbn-xsrf':'kbn-version: 5.6.10'
    },
    referrer: "http://main.toyhouse.cc:5601/app/kibana",
    referrerPolicy: "no-referrer-when-downgrade",
    body:
      '{"index":["mem_201801_toyhouse_content_first"],"ignore_unavailable":true,"preference":1536990309577}\n{"version":true,"size":500,"sort":[{"timestamp":{"order":"desc","unmapped_type":"boolean"}}],"query":{"bool":{"must":[{"match_all":{}},{"match_phrase":{"title":{"query":"' +
      title +
      '"}}},{"range":{"timestamp":{"gte":1534398941354,"lte":1536990941355,"format":"epoch_millis"}}}],"must_not":[]}},"_source":{"excludes":[]},"aggs":{"2":{"date_histogram":{"field":"timestamp","interval":"12h","time_zone":"Asia/Shanghai","min_doc_count":1}}},"stored_fields":["*"],"script_fields":{},"docvalue_fields":["timestamp"],"highlight":{"pre_tags":["@kibana-highlighted-field@"],"post_tags":["@/kibana-highlighted-field@"],"fields":{"*":{"highlight_query":{"bool":{"must":[{"match_all":{}},{"match_phrase":{"title":{"query":"MyDairy:马荃个人学习日志-9月14日"}}},{"range":{"timestamp":{"gte":1534398941354,"lte":1536990941355,"format":"epoch_millis"}}}],"must_not":[]}}}},"fragment_size":2147483647}}\n',
    //TODO: 拆分时间选择 lte / gte
    method: "POST",
    mode: "cors",
  }).then(res => res.text())
  .then(data => {
    return JSON.parse(data).responses[0].hits.hits[0]._source.source_text
  })
  .catch(function(error) {
    console.log('error: ' + error);
  })
};




//日志抓取后格式如下
//{"responses":[{"took":4,"timed_out":false,"_shards":{"total":4,"successful":4,"skipped":0,"failed":0},"hits":{"total":1,"max_score":null,"hits":[{"_index":"mem_201801_toyhouse_content_first","_type":"page","_id":"2984","_version":9,"_score":null,"_source":{"version":25066,"wiki":"mem_201801_toyhouse","namespace":0,"namespace_text":"","title":"MyDairy:马荃个人学习日志-9月14日","timestamp":"2018-09-15T00:31:25Z","category":["MyDairy MEM2","MEM2 4"],"external_link":[],"outgoing_link":[],"template":[],"text":"XLP 第二天  上来就被怼可持续设计 好的设计可以把各个领域的知识串起来 什么是设计 - 创造性的设计 - 提出对未来的愿景 设计 做的不好 就是效果图 形式决定一些功能 串起产品、商业、政策、社会、文化 研究事物间的关系，适合最好 品 是节制、是反思 需求：want need 可持续发展是什么呢：不做有害于未来的事情 可持续发展的scope：环境、社会、经济 设计是善意的 生态设计：产品生命周期     《食品创新设计》听到好多吃的 《创意生长的思维逻辑》 感受最深的话：最大的挑战，不是没有需求，也不是没有生产，是没有需求和生产之间的匹配    5分-非常满意","source_text":"[[category:MyDairy_MEM2]]\n\nXLP 第二天\n\n* 上来就被怼\n\n可持续设计\n\n好的设计可以把各个领域的知识串起来\n\n什么是设计\n\n- 创造性的设计\n\n- 提出对未来的愿景\n\n设计 做的不好 就是效果图\n\n形式决定一些功能\n\n串起产品、商业、政策、社会、文化\n\n研究事物间的关系，适合最好\n\n品 是节制、是反思\n\n需求：want need\n\n可持续发展是什么呢：不做有害于未来的事情\n\n可持续发展的scope：环境、社会、经济\n\n设计是善意的\n\n生态设计：产品生命周期\n\n \t\n《食品创新设计》听到好多吃的\n\n《创意生长的思维逻辑》\n\n感受最深的话：最大的挑战，不是没有需求，也不是没有生产，是没有需求和生产之间的匹配\n\n\n===课程评价===\n5分-非常满意\n\n==欢迎留言帮助改进==\n\n[[category:MyDairy_MEM2]]\n[[category:MEM2_4]]","text_bytes":889,"content_model":"wikitext","language":"en","heading":["课程评价","欢迎留言帮助改进"],"opening_text":"XLP 第二天  上来就被怼可持续设计 好的设计可以把各个领域的知识串起来 什么是设计 - 创造性的设计 - 提出对未来的愿景 设计 做的不好 就是效果图 形式决定一些功能 串起产品、商业、政策、社会、文化 研究事物间的关系，适合最好 品 是节制、是反思 需求：want need 可持续发展是什么呢：不做有害于未来的事情 可持续发展的scope：环境、社会、经济 设计是善意的 生态设计：产品生命周期    《食品创新设计》听到好多吃的 《创意生长的思维逻辑》 感受最深的话：最大的挑战，不是没有需求，也不是没有生产，是没有需求和生产之间的匹配","auxiliary_text":[],"defaultsort":false,"redirect":[],"incoming_links":2},"fields":{"text.word_count":[216],"timestamp":[1536971485000]},"highlight":{"title":["@kibana-highlighted-field@MyDairy:马荃个人学习日志-9月14日@/kibana-highlighted-field@"]},"sort":[1536971485000]}]},"aggregations":{"2":{"buckets":[{"key_as_string":"2018-09-15T00:00:00.000+08:00","key":1536940800000,"doc_count":1}]}},"status":200}]}