import { notification } from 'antd';
import {
  fetchSaleAccountList,
  fetchSaleAccountDetail,
  fetchSaleAccountAdd,
  fetchSaleAccountEdit,
} from '@/services/CityomServices';

export default {
  namespace: 'saleAccount',

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
      const response = yield call(fetchSaleAccountList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchSaleAccountDetail({ payload, callback }, { call }) {
      const response = yield call(fetchSaleAccountDetail, payload);
      if (!response) return;
      const { content } = response;
      const { agentCode = '' } = content.sellMainDetail;
      const codeType = agentCode.length;
      const cityCode = {
        0: [],
        6: [agentCode.slice(0, 2), agentCode.slice(0, 4), agentCode], // 区
        4: [agentCode.slice(0, 2), agentCode], // 市
        2: [agentCode], // 省
      }[codeType];
      callback({ ...content.sellMainDetail, agentCode: cityCode });
    },
    *fetchSaleAccountAdd({ payload, callback }, { call }) {
      const response = yield call(fetchSaleAccountAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '帐号新增成功',
      });
      callback();
    },
    *fetchSaleAccountEdit({ payload, callback }, { call }) {
      const response = yield call(fetchSaleAccountEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '帐号信息修改成功',
      });
      callback();
    },
  },
};
