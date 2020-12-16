import {
  fetchChartBlockOrder,
  fetchChartBlockUser,
  fetchChartBlockMreShare,
  fetchChartBlockTradeLeft,
  fetchChartBlockTradeRight,
} from '@/services/ChartServices';

export default {
  namespace: 'chartBlock',

  state: {
    orderInfo: {},
    userInfo: {},
    mreShareTotal: {},
    tradeLeft: [],
    tradeRight: [],
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
    *fetchChartBlockOrder({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockOrder, payload);
      if (!response) return;
      const { content } = response;
      const allTotal = Object.values(content.orderInfo).reduce((prev, next) => ({
        totalFee: prev.totalFee + next.totalFee,
        docCount: prev.docCount + next.docCount,
      }));
      yield put({
        type: 'save',
        payload: {
          orderInfo: { allTotal, ...content.orderInfo },
        },
      });
    },
    *fetchChartBlockUser({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockUser, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userInfo: content,
        },
      });
    },
    *fetchChartBlockMreShare({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockMreShare, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          mreShareTotal: {
            send: { totalFee: content.totalMoments, docCount: content.avgMoments },
            view: { totalFee: content.viewAmount, docCount: content.avgViewAmount },
            bean: { totalFee: content.totalBean, docCount: content.avgBean },
          },
        },
      });
    },
    *fetchChartBlockTradeLeft({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          tradeRight: [],
        },
      });
      const response = yield call(fetchChartBlockTradeLeft, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          tradeLeft: content.category,
        },
      });
      if (content.category.length) {
        yield put({
          type: 'fetchChartBlockTradeRight',
          payload: { ...payload, topCategoryId: content.category[0].categoryId },
        });
      }
    },
    *fetchChartBlockTradeRight({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockTradeRight, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          tradeRight: content.category,
        },
      });
    },
  },
};
