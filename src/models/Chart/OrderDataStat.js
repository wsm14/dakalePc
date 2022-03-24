import {
  fetchOrderTrendAnalysisReport,
  fetchOrderPayAnalysisReport,
} from '@/services/ChartServices';
import {
  ORDER_GOODS_TYPE,
  ORDER_GOODS_TYPES,
  USER_ANALYSIS_CONTRAS,
  ORDER_GOODS_CONTRAS,
} from '@/common/constant';

const totalNum = (list, key) => {
  return list.reduce((preValue, curValue) => preValue + Number(curValue[key]), 0);
};

export default {
  namespace: 'orderDataStat',

  state: {
    newRegisterDataObj: { dataList: [] },
    payList: [],
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    *fetchOrderTrendAnalysisReport({ payload }, { call, put }) {
      const response = yield call(fetchOrderTrendAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { analysisList = [], ...other } = content;

      let newArr = [];
      analysisList.forEach((item) => {
        const { analysisDay, analysisMonth, ...other } = item;
        Object.keys(other).forEach((cell) => {
          console.log(other[cell]);
          newArr.push({
            analysisDay: analysisDay || analysisMonth,
            value: Number(other[cell]),
            type: ORDER_GOODS_TYPE[cell],
            types: ORDER_GOODS_TYPES.filter((item) => item.label === ORDER_GOODS_TYPE[cell])[0]
              .value,
          });
        });
      });

      yield put({
        type: 'save',
        payload: {
          newRegisterDataObj: { dataList: newArr, ...other },
        },
      });
    },
    *fetchOrderPayAnalysisReport({ payload }, { call, put }) {
      const { subStatisticType = 'payDevice' } = payload;
      const response = yield call(fetchOrderPayAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { analysisList = [] } = content;

      let payList = [];
      if (subStatisticType === 'payDevice') {
        payList = analysisList.map((item) => ({
          value: Number(Number(item.totalMoney).toFixed(2)),
          type: `${USER_ANALYSIS_CONTRAS[item.payType]} 丨 ${(
            (Number(item.totalMoney) / totalNum(analysisList, 'totalMoney')) *
            100
          ).toFixed(2)}%`,
        }));
      } else {
        payList = analysisList.map((item) => ({
          value: Number(Number(item.totalMoney).toFixed(2)),
          type: `${ORDER_GOODS_CONTRAS[item.payType]} 丨 ${(
            (Number(item.totalMoney) / totalNum(analysisList, 'totalMoney')) *
            100
          ).toFixed(2)}%`,
        }));
      }

      yield put({
        type: 'save',
        payload: {
          payList: payList.sort((a, b) => b.value - a.value),
        },
      });
    },
  },
};
