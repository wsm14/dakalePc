import { notification } from 'antd';
import {
  fetchClassifyList,
  fetchGoodsGetMre,
  fetchClassifyAdd,
  fetchClassifyDel,
  fetchClassifyEdit,
} from '@/services/BusinessServices';

export default {
  namespace: 'classifyManage',

  state: {
    list: [],
    total: 0,
    mreSelect: [],
    merFormSelect: [],
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
      const response = yield call(fetchClassifyList, payload);
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
    *fetchClassifyGetMre({ payload, callback }, { call, put }) {
      const response = yield call(fetchGoodsGetMre, payload);
      if (!response) return;
      const { content } = response;
      const { type } = payload;
      yield put({
        type: 'save',
        payload: {
          [type ? 'merFormSelect' : 'mreSelect']: content.userMerchantList.map((item) => ({
            name: item.merchantName,
            otherData: item.address,
            value: item.merchantId,
          })),
        },
      });
      callback && callback();
    },
    *fetchClassifyAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分类新增成功',
      });
      callback();
    },
    *fetchClassifyEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分类修改成功',
      });
      callback();
    },
    *fetchClassifyDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分类删除成功',
      });
      callback();
    },
  },
};
