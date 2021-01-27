import { notification } from 'antd';
import {
  fetchExpertSetList,
  fetchExpertAdd,
  fetchClassifyEdit,
  fetchClassifyDetailList,
  fetchClassifyDetailAdd,
  fetchClassifyDetailSet,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertSet',

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
      const response = yield call(fetchExpertSetList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.domainDTO.domainDTOList || [] },
        },
      });
    },
    *fetchClassifyDetailList({ payload }, { call, put }) {
      const response = yield call(fetchClassifyDetailList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.recordList },
        },
      });
    },
    *fetchExpertAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpertAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '领域设置成功',
      });
      callback();
    },
    *fetchClassifyEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '内容分类修改成功',
      });
      callback();
    },
    *fetchClassifyDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '内容分类删除成功',
      });
      callback();
    },
    *fetchClassifyDetailAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyDetailAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '话题新增成功',
      });
      callback();
    },
    *fetchClassifyDetailSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyDetailSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '创作设置成功',
      });
      callback();
    },
  },
};
