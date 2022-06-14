import { notification } from 'antd';
import {
  fetchGoodsTagList,
  fetchGoodsTagAdd,
  fetchGoodsTagUpdate,
  fetchGoodsTagSort,
  fetchGoodsTagSwitchStatus,
  fetchConfigGoodsList,
  fetchConfigGoodsDel,
  fetchConfigGoodsAdd,
  fetchTagSortSet,
} from '@/services/BaseServices';

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
    *fetchConfigGoodsList({ payload }, { call, put }) {
      const response = yield call(fetchConfigGoodsList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          configGoodsList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchConfigGoodsSet({ payload, callback }, { call }) {
      const { mode, ...other } = payload;
      const fetchApi = {
        add: fetchConfigGoodsAdd,
        del: fetchConfigGoodsDel,
      }[mode];
      const fetchText = {
        add: '新增',
        del: '移除',
      }[mode];
      const response = yield call(fetchApi, other);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `${fetchText}成功`,
      });
      callback();
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
    *fetchTagSortSet({ payload, callback }, { call }) {
      const response = yield call(fetchTagSortSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改权重成功',
      });
      callback();
    },
  },
};
