import { notification } from 'antd';
import { fetchProvList, fetchProvAdd, fetchProvEdit } from '@/services/CityomServices';

export default {
  namespace: 'provCompany',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
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
      const response = yield call(fetchProvList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchProvAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '省公司新增成功',
      });
      callback();
    },
    *fetchProvEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '省公司信息修改成功',
      });
      callback();
    },
  },
};
