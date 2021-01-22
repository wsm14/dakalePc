import { notification } from 'antd';
import {
  fetchSubsidyTaskList,
  fetchSubsidyTaskGetExcel,
  fetchSubsidyTaskDetail,
  fetchSubsidyTaskEndDel,
  fetchSubsidyTaskAdd,
  fetchSubsidyActionList,
  fetchSubsidyActionDel,
} from '@/services/FinanceServices';

export default {
  namespace: 'subsidyManage',

  state: {
    list: { list: [], total: 0 },
    actionList: { list: [], total: 0 },
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
    *fetchGetTaskList({ payload }, { call, put }) {
      const response = yield call(fetchSubsidyTaskList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchSubsidyActionList({ payload }, { call, put }) {
      const response = yield call(fetchSubsidyActionList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          actionList: {
            list: content.configBehaviorList,
            total: content.configBehaviorList.length,
          },
        },
      });
    },
    *fetchSubsidyTaskGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyTaskGetExcel, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.subsidyList);
    },
    *fetchSubsidyTaskDetail({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyTaskDetail, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.subsidy);
    },
    *fetchSubsidyTaskEndDel({ payload, callback }, { call }) {
      const { deleteFlag } = payload;
      const response = yield call(fetchSubsidyTaskEndDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `任务${deleteFlag === 0 ? '删除' : '结束'}成功`,
      });
      callback();
    },
    *fetchSubsidyTaskAdd({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyTaskAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '任务新增成功',
      });
      callback();
    },
    *fetchSubsidyActionDel({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyActionDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '行为删除成功',
      });
      callback();
    },
  },
};
