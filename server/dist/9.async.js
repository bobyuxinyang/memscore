(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{zX0F:function(a,e,t){"use strict";var s=t("4Gf+");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=s(t("OjS7")),r=s(t("BZ3U")),i=t("dCQc"),l={namespace:"chart",state:{visitData:[],visitData2:[],salesData:[],searchData:[],offlineData:[],offlineChartData:[],salesTypeData:[],salesTypeDataOnline:[],salesTypeDataOffline:[],radarData:[],scoreList:[],loading:!1},effects:{memscore:r.default.mark(function a(e,t){var s,n,l;return r.default.wrap(function(a){while(1)switch(a.prev=a.next){case 0:return s=t.call,n=t.put,a.next=3,s(i.getMemscoreList);case 3:return l=a.sent,a.next=6,n({type:"save",payload:{scoreList:l}});case 6:case"end":return a.stop()}},a,this)})},reducers:{save:function(a,e){var t=e.payload;return console.log("payload: ",t),(0,n.default)({},a,t)},clear:function(){return{visitData:[],visitData2:[],salesData:[],searchData:[],offlineData:[],offlineChartData:[],salesTypeData:[],salesTypeDataOnline:[],salesTypeDataOffline:[],radarData:[]}}}};e.default=l}}]);