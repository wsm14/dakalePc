import numeral from 'numeral';
import {
  fetchChartBlockOrder,
  fetchChartBlockUser,
  fetchChartBlockMreShare,
  fetchChartBlockTradeLeft,
  fetchChartBlockTradeRight,
  fetchChartBlockIncomeLeft,
  fetchChartBlockSaleRight,
  fetchChartBlockSale,
  fetchChartBlockAreaMer,
  fetchChartMapHub,
  fetchChartMapHubMre,
  fetchChartMapHubMreDeatil,
} from '@/services/ChartServices';

export default {
  namespace: 'chartBlock',

  state: {
    orderInfo: {},
    userInfo: {},
    mreShareTotal: {},
    tradeLeft: [],
    tradeRight: [],
    saleRank: [],
    incomeRank: [],
    mapHub: [],
    mapHubId: [],
    mapHubDetail: [],
    saleLeft: {},
    areaMer: [],
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
    *fetchChartBlockSale({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockSale, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          saleLeft: content,
        },
      });
    },
    *fetchChartBlockAreaMer({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockAreaMer, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          areaMer: content.merchantStatistic,
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
    *fetchChartBlockIncomeLeft({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockIncomeLeft, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          incomeRank: content.rankList.map((item) => {
            const { verificationFee, scan, merchantName } = item;
            const allTotal = verificationFee + scan;
            const verificationFeeNum = ((verificationFee / allTotal) * 100).toFixed(2);
            return {
              merchantName,
              allTotal,
              verificationFee: allTotal === 0 ? 0 : verificationFeeNum,
              scan: allTotal === 0 ? 0 : 100 - verificationFeeNum,
            };
          }),
        },
      });
    },
    *fetchChartBlockSaleRight({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockSaleRight, payload);
      if (!response) return;
      const { content } = response;
      const numFormat = (val) => numeral(val).format('0,0');
      yield put({
        type: 'save',
        payload: {
          saleRank: content.saleRankList.map((item) => ({
            ...item,
            visitTimes: numFormat(item.visitTimes),
            settleCount: numFormat(item.settleCount),
            activeCount: numFormat(item.activeCount),
          })),
        },
      });
    },
    *fetchChartMapHub({ payload }, { call, put }) {
      const response = yield call(fetchChartMapHub, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          mapHub: content.businessHubList,
          mapHubId: content.businessHubList.map((item) => item.businessHubIdString),
        },
      });
    },
    *fetchChartMapHubMre({ payload, callback }, { call, put }) {
      const response = yield call(fetchChartMapHubMre, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          mapHubDetail: content.merchantList.map((item) => ({
            position: { longitude: Number(item.lnt), latitude: Number(item.lat), ...item },
          })),
        },
      });
      callback && callback();
    },
    *fetchChartMapHubMreDeatil({ payload, callback }, { call, put }) {
      const response = yield call(fetchChartMapHubMreDeatil, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content.merchantDetail);
    },
  },
};
