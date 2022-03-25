import {
  fetchOrderTrendAnalysisReport,
  fetchOrderPayAnalysisReport,
  fetchOrderConvertAnalysisReport,
  fetchOrderBeanAnalysisReport,
} from '@/services/ChartServices';
import {
  ORDER_GOODS_TYPE,
  ORDER_GOODS_TYPES,
  USER_ANALYSIS_CONTRAS,
  ORDER_GOODS_CONTRAS,
  GOODS_ORDER_CONTRAS,
} from '@/common/constant';

const totalNum = (list, key) => {
  return list.reduce((preValue, curValue) => preValue + Number(curValue[key]), 0);
};

export default {
  namespace: 'orderDataStat',

  state: {
    newRegisterDataObj: { dataList: [] },
    payList: [],
    moneyData: {},
    pieList: { list: [], allBeanMoney: 0, allBeanMoneyRatio: '' },
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
    *fetchOrderConvertAnalysisReport({ payload }, { call, put }) {
      const { subStatisticType = 'specialGoods' } = payload;
      const response = yield call(fetchOrderConvertAnalysisReport, payload);
      const { content = {} } = response;
      const { placeOrder = {}, paidOrder = {} } = content;

      // 订单均价
      const paidAverage = (Number(paidOrder.totalOrderMoney) / paidOrder.totalOrderAmount).toFixed(
        2,
      );
      // 支付转换率
      const payPercent = `${(paidOrder.totalOrderAmount / placeOrder.totalOrderAmount).toFixed(
        2,
      )}%`;

      yield put({
        type: 'save',
        payload: {
          moneyData: { ...content, paidAverage, payPercent },
        },
      });
    },
    *fetchOrderBeanAnalysisReport({ payload }, { call, put }) {
      const response = yield call(fetchOrderBeanAnalysisReport, payload);
      const { content = {} } = response;
      const { analysisList = [] } = content;

      const list = analysisList.map((item) => ({
        value: Number(
          ((item.beanAmountSum / 100 / Number(item.totalMoneySum) || 0) * 100).toFixed(0),
        ),
        type: GOODS_ORDER_CONTRAS[item.placeType],
        beanMoney: `￥${item.beanAmountSum / 100}`,
      }));
      const allBeanMoney = totalNum(analysisList, 'beanAmountSum') / 100;
      const allMoney = totalNum(analysisList, 'totalMoneySum');
      const allBeanMoneyRatio = `${((allBeanMoney / allMoney) * 100).toFixed(0)}%`;

      yield put({
        type: 'save',
        payload: {
          pieList: { list, allBeanMoney, allBeanMoneyRatio },
        },
      });
    },
  },
};
