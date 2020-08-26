import { notification } from 'antd';
import {
  fetchTradeList,
  fetchTradeDetail,
  fetchTradeAdd,
  fetchTradeDel,
  fetchTradeEdit,
  fetchTradeBaseList,
  fetchTradePlatformList,
  fetchTradeSpecialList
} from '@/services/SystemServices';

export default {
  namespace: 'sysTradeList',

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
    clearDetail(state, { payload }) {
      return {
        ...state,
        ...payload,
        detailList: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchTradeList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.categoryDTOList },
        },
      });
    },
    *fetchTradeDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type } = payload;
      const inter = {
        base: fetchTradeBaseList, // 基础设施
        platform: fetchTradePlatformList, // 平台服务费
        special: fetchTradeSpecialList, // 特色服务
      }[type];
      delete payload.type;
      const response = yield call(inter, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.roleList, total: content.totalCount },
        },
      });
    },
    *fetchTradeAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增类目成功',
      });
      callback();
    },
    *fetchTradeEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改类目成功',
      });
      callback();
    },
    *fetchTradeDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '删除类目成功',
      });
      callback();
    },
  },
};
