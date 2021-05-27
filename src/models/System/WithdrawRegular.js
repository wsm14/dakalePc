import { notification } from 'antd';
import { fetchWithdrawRegularList, fetchWithdrawUpdate } from '@/services/SystemServices';

export default {
  namespace: 'widthdrawRegularList',
  state: {
    list: { list: [], total: 0 },
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
    *fetchWithdrawRegularList({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawRegularList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchWithdrawUpdate({ payload, callback }, { call, put }) {
      const response = yield call(fetchWithdrawUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '备注设置成功',
      });
      callback();
    },
  },
};
