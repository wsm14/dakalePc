import {} from '@/services/ChartServices';
import {} from '@/common/constant';

const totalNum = (list, key) => {
  return list.reduce((preValue, curValue) => preValue + curValue[key], 0);
};

export default {
  namespace: 'gameDataStat',

  state: {},

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    // *fetchUserAnalysisReport({ payload }, { call, put }) {
    //   const response = yield call(fetchUserAnalysisReport, payload);
    //   if (!response) return;
    //   const { content = {} } = response;
    //   console.log('content',content);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       newRegisterDataObj: { dataList: newArr, ...other },
    //     },
    //   });
    // },
  },
};
