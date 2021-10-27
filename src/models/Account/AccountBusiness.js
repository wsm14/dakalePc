import {
  fetchAccountBusinessList,
  fetchAccountBusinessTotal,
  fetchBusinessPeasDetail,
  fetchBusinessCollectDetail,
  fetchBusinessRechargeDetail,
  fetchBusinessPlatformBeanDetail,
  fetchBusinessCashDetail,
} from '@/services/AccountServices';

const data1 = [
  {
    statisticDesc: '无',
    content: 0,
  },
];

export default {
  namespace: 'accountBusiness',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    indata: data1,
    outdata: data1,
    merchantTotalIncome: 0,
    merchantTotalOut: 0,
    merchantTotalBean: 0,
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
      const response = yield call(fetchAccountBusinessList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type, tabKey } = payload;
      const inter = {
        peas: tabKey == '1' ? fetchBusinessPlatformBeanDetail : fetchBusinessPeasDetail, // 卡豆明细
        collect: fetchBusinessCashDetail, // 提现记录 => 改为现金账户明细
        recharge: fetchBusinessRechargeDetail, // 充值记录
      }[type];
      delete payload.type;
      delete payload.tabKey;
      const response = yield call(inter, payload);
      if (!response) return;
      const { content } = response;
      console.log('content', content);
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchBusinessTotal({ payload }, { call, put }) {
      const response = yield call(fetchAccountBusinessTotal, payload);
      if (!response) return;
      const { in: indata, out: outdata, merchantTotalBean = 0 } = response.content;
      // 计算总数
      const totalReduce = (arr, type) =>
        arr.reduce((pre, cur) => {
          if (cur.statisticType === type) {
            return pre + 0;
          }
          return pre + Number(cur.content || 0);
        }, 0);
      // 商家累计收益
      const merchantTotalIncome = indata.length ? totalReduce(indata, 'merchantTotalIncome') : 0;
      // 商家累计消费
      const merchantTotalOut = outdata.length ? totalReduce(outdata, 'merchantTotalOut') : 0;

      yield put({
        type: 'save',
        payload: {
          merchantTotalIncome,
          merchantTotalOut,
          merchantTotalBean,
          indata: indata.length
            ? indata
                .filter((item) => item.statisticType != 'merchantTotalIncome')
                .map((item) => ({
                  content: Number(item.content),
                  statisticDesc: item.statisticDesc.replace('商家', ''),
                }))
            : data1,
          outdata: outdata.length
            ? outdata
                .filter((item) => item.statisticType != 'merchantTotalOut')
                .map((item) => ({
                  content: Number(item.content),
                  statisticDesc: item.statisticDesc.replace('商家', ''),
                }))
            : data1,
        },
      });
    },
  },
};
