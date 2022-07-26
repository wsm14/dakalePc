import { notification } from 'antd';
import {
  fetchExpertUserAchievementTotalList,
  fetchCombineBuyList,
  fetchCombineBuyImportExcel,
  fetchExcelImportExcel,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertUserAchievementTotal',

  state: {
    list: { list: [], total: 0 },
    combineBuyList: { list: [], total: 0 },
    subList: { list: [], total: 0 },
    subTotal: {},
    recommendList: {},
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    closeRecommend(state) {
      return {
        ...state,
        recommendList: {},
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchExpertUserAchievementTotalList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.userList, total: content.total },
        },
      });
    },
    // 哒人业绩列表 - 导出
    *fetchExcelImportExcel({ payload }, { call, put }) {
      const response = yield call(fetchExcelImportExcel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '导出成功',
      });
    },
    // 团购业绩统计 - 列表
    *fetchCombineBuyList({ payload }, { call, put }) {
      const response = yield call(fetchCombineBuyList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          combineBuyList: { list: content.userList, total: content.total },
        },
      });
    },
    // 团购业绩列表 - 导出
    *fetchCombineBuyImportExcel({ payload }, { call, put }) {
      const response = yield call(fetchCombineBuyImportExcel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '导出成功',
      });
    },
  },
};
