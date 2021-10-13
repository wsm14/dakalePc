import { notification } from 'antd';
import {
  fetchBlindBoxList,
  fetchBlindBoxConfigList,
  fetchBlindBoxConfigSet,
} from '@/services/ActiveServices';

export default {
  namespace: 'prizeConfig',

  state: {
    blindBox: [],
    blindBoxRule: { participateBlindBoxProducts: [] },
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
    *fetchBlindBoxList({ payload }, { call, put }) {
      const response = yield call(fetchBlindBoxList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          blindBox: content.blindBoxProductObjects,
        },
      });
    },
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchBlindBoxConfigList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          blindBoxRule: content.blindBoxRule,
        },
      });
    },
    *fetchBlindBoxConfigSet({ payload, callback }, { call }) {
      const response = yield call(fetchBlindBoxConfigSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '配置成功',
      });
      callback && callback();
    },
  },
};
