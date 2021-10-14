import { notification } from 'antd';
import {
  fetchBoxLotteryList,
  fetchBoxLotteryExport,
  fetchBoxDetail,
  fetchBoxAddAndPush,
} from '@/services/ActiveServices';

export default {
  namespace: 'boxLottery',

  state: {
    list: [],
    total: 0,
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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchBoxLotteryList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchBoxLotteryExport, payload);
      if (!response) return;
      const { content } = response;
      console.log(callback)
      if (callback) callback(content.userBlindBoxRewardDTOS);
    },
    *fetchBoxPushDetail({ payload, callback }, { call }) {
      const response = yield call(fetchBoxDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content?.logisticsInfo);
    },
    *fetchBoxAddAndPush({ payload, callback }, { call }) {
      const response = yield call(fetchBoxAddAndPush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '发货成功',
      });
      callback();
    },
  },
};
