import { notification } from 'antd';
import {
  fetchSubsidyTaskList,
  fetchSubsidyTaskGetExcel,
  fetchSubsidyTaskDetail,
  fetchSubsidyTaskEndDel,
  fetchSubsidyTaskAdd,
  fetchSubsidyDirectAdd,
  fetchSubsidyRecycleBean,
  fetchSubsidyActionList,
  fetchSubsidyActionAdd,
  fetchSubsidyActionDel,
  fetchActionBatchEdit,
  fetchListSubsidyDetailAll,
} from '@/services/FinanceServices';

export default {
  namespace: 'subsidyManage',

  state: {
    list: { list: [], total: 0 },
    actionList: { list: [], total: 0 },
    detailList: { list: [] },
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
    *fetchSubsidyTaskDetailList({ payload }, { call, put }) {
      const { role, ...other } = payload;
      const response = yield call(fetchListSubsidyDetailAll, other);
      if (!response) return;
      const { content = {} } = response;
      const {
        userInfoObjects = [],
        merchantGroupObjects = [],
        userMerchantObjects = [],
        cityObjects = [],
        partnerObjects = [],
        totalBeans,
      } = content.subsidyDTO;

      const detailList = {
        user: userInfoObjects,
        group: merchantGroupObjects,
        merchant: userMerchantObjects,
        city: cityObjects,
        partner: partnerObjects,
      }[role];

      yield put({
        type: 'save',
        payload: {
          detailList: { list: detailList, total: detailList?.length || 0, totalBeans },
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
        description: `${deleteFlag === 0 ? '删除' : '结束'}成功`,
      });
      callback();
    },
    *fetchSubsidyTaskAdd({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyTaskAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '营销卡豆充值新增成功',
      });
      callback();
    },
    *fetchSubsidyDirectAdd({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyDirectAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '平台直充新增成功',
      });
      callback();
    },
    *fetchSubsidyRecycleBean({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyRecycleBean, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '卡豆回收新建成功',
      });
      callback();
    },
    *fetchSubsidyActionAdd({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyActionAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '使用规则设置成功',
      });
      callback();
    },
    *fetchSubsidyActionDel({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyActionDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '使用规则删除成功',
      });
      callback();
    },
    *fetchActionBatchEdit({ payload, callback }, { call }) {
      const response = yield call(fetchActionBatchEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '使用规则批量修改成功',
      });
      callback();
    },
  },
};
