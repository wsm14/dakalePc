import { notification } from 'antd';
import {
  fetchExpertTempList,
  fetchExpertTempAdd,
  fetchExpertTempStop,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertTempList',

  state: {
    list: { list: [], total: 0 },
    userTotal: 0,
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
      const response = yield call(fetchExpertTempList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchExpertTempAdd({ payload, callback }, { call }) {
      const response = yield call(fetchExpertTempStop, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增实习成功',
      });
      callback();
    },
    *fetchExpertTempStop({ payload, callback }, { call }) {
      const response = yield call(fetchExpertTempStop, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '取消实习成功',
      });
      callback();
    },
  },
};
