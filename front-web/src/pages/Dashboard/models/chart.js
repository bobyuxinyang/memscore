import { fakeChartData, getMemscoreList } from '@/services/api';

export default {
  namespace: 'chart',

  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    scoreList: [],
    loading: false,
  },

  effects: {
    *memscore(_, { call, put}) {
      const response = yield call(getMemscoreList);
      yield put({
        type: 'save',
        payload: {
          scoreList: response
        },
      })
    }
  },

  reducers: {
    save(state, { payload }) {
      console.log('payload: ', payload)
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
