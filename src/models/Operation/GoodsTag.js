import { notification } from 'antd';
import {
  fetchGoodsTagList,
  fetchGoodsTagAdd,
  fetchGoodsTagUpdate,
  fetchGoodsTagSort,
  fetchGoodsTagSwitchStatus,
  fetchConfigGoodsList,
} from '@/services/OperationServices';

export default {
  namespace: 'goodsTag',

  state: {
    list: [],
    configGoodsList: { list: [], total: 0 },
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
    *fetchGoodsTagList({ payload, callback }, { call, put }) {
      const response = yield call(fetchGoodsTagList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.configGoodsTagDTOS,
        },
      });
      callback && callback(content.configGoodsTagDTOS);
    },
    *fetchConfigGoodsList({ payload, callback }, { call, put }) {
      const response = yield call(fetchConfigGoodsList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          configGoodsList: { list: content.recordList, total: content.total },
        },
      });
      callback && callback(content.configGoodsTagDTOS);
    },
    *fetchGoodsTagAdd({ payload, callback }, { call }) {
      const response = yield call(fetchGoodsTagAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '标签新增成功',
      });
      callback();
    },
    *fetchGoodsTagUpdate({ payload, callback }, { call }) {
      const response = yield call(fetchGoodsTagUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '标签修改成功',
      });
      callback();
    },
    *fetchGoodsTagSort({ payload, callback }, { call }) {
      const response = yield call(fetchGoodsTagSort, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '标签排序成功',
      });
      callback();
    },
    *fetchGoodsTagSwitchStatus({ payload, callback }, { call }) {
      const response = yield call(fetchGoodsTagSwitchStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
      });
      callback();
    },
  },
};
