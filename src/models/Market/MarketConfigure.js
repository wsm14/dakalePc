import { notification } from 'antd';
import {
  fetchGlobalPopUpList,
  fetchGlobalPopUpAdd,
  fetchGlobalPopUpEdit,
} from '@/services/MarketServices';

export default {
  namespace: 'marketConfigure',

  state: {
    modalEditionList: { list: [] },
    modalCityList: { list: [] },
    modalConfigureList: { list: [] },
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
    *fetchGlobalPopUpEditionList({ payload }, { call, put }) {
      const response = yield call(fetchGlobalPopUpList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          modalEditionList: { list: content.configGlobalPopUpDTOS },
        },
      });
    },
    *fetchGlobalPopUpAdd({ payload, callback }, { call }) {
      const response = yield call(fetchGlobalPopUpAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    //全局弹窗配置-修改版本-编辑配置-编辑权重
    *fetchGlobalPopUpEdit({ payload, callback }, { call }) {
      const response = yield call(fetchGlobalPopUpEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback();
    },
    *fetchGlobalPopUpCityList({ payload }, { call, put }) {
      const response = yield call(fetchGlobalPopUpList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          modalCityList: { list: content.configGlobalPopUpDTOS },
        },
      });
    },
    *fetchGlobalPopUpModalList({ payload }, { call, put }) {
      const response = yield call(fetchGlobalPopUpList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          modalConfigureList: { list: content.configGlobalPopUpDTOS },
        },
      });
    },
  },
};
