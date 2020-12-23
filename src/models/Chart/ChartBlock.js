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
  fetchChartMasterData,
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
    masterBarData: [],
    masterDountLeftData: [],
    masterDountRightData: [],
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
      const allTotal = {
        totalFee: content.orderInfo.scan.totalFee + content.orderInfo.verificationFee.totalFee,
        docCount: content.orderInfo.scan.docCount + content.orderInfo.verificationFee.docCount,
      };
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
      const numFormat = (val) => Number(val);
      Object.keys(content).forEach((item) => (content[item] = numFormat(content[item])));
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
    *fetchChartMasterData({ payload }, { call, put }) {
      const response = yield call(fetchChartMasterData, payload);
      if (!response) return;
      const { content } = response;
      const barArr = ['人推人', '人推店', '店推人', '店推店'];
      const dountArr = ['商家家主', '用户家主'];
      const dountTowArr = ['商家家主收益', '用户家主收益'];
      yield put({
        type: 'save',
        payload: {
          masterDountLeftData: content.familyStatistic.filter(
            (item) => dountArr.indexOf(item.type) > -1,
          ),
          masterDountRightData: content.familyStatistic
            .filter((item) => dountTowArr.indexOf(item.type) > -1)
            .map((item) => ({ ...item, type: item.type.replace('收益', '') })),
          masterBarData: content.familyStatistic.filter((item) => barArr.indexOf(item.type) > -1),
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
      const numFormat = (val) => Number(val);
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
