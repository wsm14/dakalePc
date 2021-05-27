import { notification } from 'antd';
import { fetchSaleAchievementList } from '@/services/ChartServices';

export default {
  namespace: 'saleAchievement',

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
      const response = yield call(fetchSaleAchievementList, payload);
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
    *fetchGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchSaleAchievementList, payload);
      if (!response) return;
      const { content } = response;
      if (!content.recordList.length) {
        notification.success({
          message: '温馨提示',
          description: '请勿导出空数据',
        });
        return;
      }
      callback(content.recordList);
    },
  },
};
