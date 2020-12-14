import {
  fetchMasterTotal,
  fetchMasterTotalList,
  fetchMasterList,
  fetchMasterFamily,
  fetchMasterShop,
  fetchMasterIncomeDetails,
} from '@/services/UserServices';

const data1 = [
  {
    statisticDesc: '无',
    content: 0,
  },
];

export default {
  namespace: 'circleMaster',

  state: {
    masterList: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    masterTotal: data1,
    incomeTotal: data1,
    totalListData: [
      { type: 'childUserCount', rankList: [] },
      { type: 'childMerchantCount', rankList: [] },
      { type: 'familyEarnRank', rankList: [] },
    ],
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearDetail(state, { payload }) {
      return {
        ...state,
        ...payload,
        detailList: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMasterList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          masterList: { list: content.voList, total: content.total },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type } = payload;
      const inter = {
        family: fetchMasterFamily, // 家人列表
        shop: fetchMasterShop, // 家店列表
        income: fetchMasterIncomeDetails, // 收益明细
      }[type];
      delete payload.type;
      const response = yield call(inter, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchMasterTotal({ payload }, { call, put }) {
      const response = yield call(fetchMasterTotal, payload);
      if (!response) return;
      const { earn, parent } = response.content;
      yield put({
        type: 'save',
        payload: {
          masterTotal: parent.map((item) => ({
            content: Number(item.content),
            statisticDesc: item.statisticDesc,
          })),
          incomeTotal: earn.map((item) => ({
            content: Number(item.content),
            statisticDesc: item.statisticDesc,
          })),
        },
      });
    },
    *fetchMasterTotalList({ payload }, { call, put }) {
      const response = yield call(fetchMasterTotalList, payload);
      if (!response) return;
      const { content } = response;
      if (!content.records.length) return;
      yield put({
        type: 'save',
        payload: {
          totalListData: content.records,
        },
      });
    },
  },
};
