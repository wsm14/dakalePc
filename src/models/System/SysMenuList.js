import { notification } from 'antd';
import { fetchMenuList, fetchGetMenuDetail, fetchMenuSet } from '@/services/SystemServices';

export default {
  namespace: 'sysMenuList',

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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMenuList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.accessList, total: content.accessList.length },
        },
      });
    },
    *fetchGetMenuDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetMenuDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.accessInfo);
    },
    *fetchMenuSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMenuSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '菜单设置成功',
      });
      callback();
    },
  },
};
