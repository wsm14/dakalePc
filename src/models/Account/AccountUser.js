import {
  fetchAccountUserTotal,
  fetchAccountUserList,
  fetchUserPeasDetail,
  fetchUserRechargeDetail,
} from '@/services/AccountServices';

const data1 = [
  {
    statisticDesc: '无',
    content: 0,
  },
];

const data2 = [
  {
    statisticDesc: '无',
    content: 0,
  },
];

export default {
  namespace: 'accountUser',

  state: {
    userlist: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    userTotalIn: 0,
    userTotalOut: 0,
    indata: data1,
    outdata: data2,
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
      const response = yield call(fetchAccountUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userlist: { list: content.userDtoList },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type } = payload;
      const inter = {
        peas: fetchUserPeasDetail, // 卡豆明细
        recharge: fetchUserRechargeDetail, // 充值记录
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
    *fetchUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchAccountUserTotal, payload);
      if (!response) return;
      const { in: indata, out: outdata } = response.content;
      const userTotalIn = indata.length
        ? indata.filter((item) => item.statisticType == 'userTotalIn')[0].content
        : 0;
      const userTotalOut = outdata.length
        ? outdata.filter((item) => item.statisticType == 'userTotalOut')[0].content
        : 0;
      yield put({
        type: 'save',
        payload: {
          userTotalIn,
          userTotalOut,
          indata: indata.length
            ? indata
                .filter((item) => item.statisticType != 'userTotalIn')
                .map((item) => ({
                  content: Number(item.content),
                  statisticDesc: item.statisticDesc.replace('用户', ''),
                }))
            : data1,
          outdata: outdata.length
            ? outdata
                .filter((item) => item.statisticType != 'userTotalOut')
                .map((item) => ({
                  content: Number(item.content),
                  statisticDesc: item.statisticDesc.replace('用户', ''),
                }))
            : data2,
        },
      });
    },
  },
};
