import {
  fetchAccountUserTotal,
  fetchAccountUserList,
  fetchUserPeasDetail,
  fetchUserRechargeDetail,
  fetchUserIncomeBeanDetail,
} from '@/services/AccountServices';

const data1 = [
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
    outdata: data1,
    userTotalBean: 0,
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
          userlist: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      // {award:'奖励',earn:'收益'}
      const { type, tabKey } = payload;
      const inter = {
        peas: tabKey == 'award' ? fetchUserPeasDetail : fetchUserIncomeBeanDetail, // 卡豆明细
        recharge: fetchUserRechargeDetail, // 充值记录
      }[type];
      delete payload.type;
      delete payload.tabKey;
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
    *fetchAccountUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchAccountUserTotal, payload);
      if (!response) return;
      const { in: indata, out: outdata, userTotalBean = 0 } = response.content;
      // 计算总数
      const totalReduce = (arr, type) =>
        arr.reduce((pre, cur) => {
          if (cur.statisticType === type) {
            return pre + 0;
          }
          return pre + Number(cur.content || 0);
        }, 0);
      // 用户累计收益卡豆
      const userTotalIn = indata.length ? totalReduce(indata, 'userTotalIn') : 0;
      // 商家累计消费
      const userTotalOut = outdata.length ? totalReduce(outdata, 'userTotalOut') : 0;

      yield put({
        type: 'save',
        payload: {
          userTotalIn,
          userTotalOut,
          userTotalBean,
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
            : data1,
        },
      });
    },
  },
};
