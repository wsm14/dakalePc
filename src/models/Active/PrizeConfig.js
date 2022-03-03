import { notification } from 'antd';
import {
  fetchBlindBoxList,
  fetchBlindBoxConfigList,
  fetchBlindBoxConfigSet,
  fetchAddPrizePool,
  fetchUpdatePrizePool,
  fetchDeletePrizePool,
} from '@/services/ActiveServices';

export default {
  namespace: 'prizeConfig',

  state: {
    blindBox: [],
    blindBoxRule: { allBlindBoxProducts: [] },
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
          blindBox: content.luckPrizePoolList,
        },
      });
    },
    *fetchAddPrizePool({ payload, callback }, { call }) {
      const response = yield call(fetchAddPrizePool, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `添加成功`,
      });
      callback();
    },
    *fetchUpdatePrizePool({ payload, callback }, { call }) {
      const response = yield call(fetchUpdatePrizePool, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `修改成功`,
      });
      callback();
    },
    *fetchDeletePrizePool({ payload, callback }, { call }) {
      const response = yield call(fetchDeletePrizePool, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `删除成功`,
      });
      callback();
    },
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchBlindBoxConfigList, payload);
      if (!response) return;
      const { content = {} } = response;
      yield put({
        type: 'save',
        payload: {
          blindBoxRule: content?.blindBoxRule?.allBlindBoxProducts
            ? content?.blindBoxRule
            : { allBlindBoxProducts: [] },
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
