import moment from 'moment';
import { notification } from 'antd';
import {
  fetchOwnAccountList,
  fetchOwnAccountAdd,
  fetchOwnAccountEdit,
  fetchOwnAccountDetail,
} from '@/services/SystemServices';

export default {
  namespace: 'accountList',

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
      const response = yield call(fetchOwnAccountList, payload);
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
    *fetchOwnAccountAdd({ payload, callback }, { call }) {
      const response = yield call(fetchOwnAccountAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户新增成功',
      });
      callback();
    },
    *fetchOwnAccountDetail({ payload, callback }, { call }) {
      const response = yield call(fetchOwnAccountDetail, payload);
      if (!response) return;
      const { content } = response;
      const { entryDate, departmentId } = content.adminAccountDetail;
      callback({
        ...content.adminAccountDetail,
        entryDate: moment(entryDate),
        departmentId: [departmentId],
      });
    },
    *fetchOwnAccountEdit({ payload, callback }, { call }) {
      const response = yield call(fetchOwnAccountEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户修改成功',
      });
      callback();
    },
  },
};
