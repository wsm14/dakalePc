import { notification } from 'antd';
import {
  fetchWithdrawList,
  fetchWithdrawTotal,
  fetchWithdrawExportExcel,
  fetchWithdrawSetRemark,
  fetchWithdrawExpertList,
  fetchWithdrawExpertTotal,
  fetchWithdrawExpertSetRemark,
  fetchWithdrawManagementList,
  fetchWithdrawManagementTotal,
  fetchWithdrawExportManagementExcel,
  fetchListCityPartnerWithdrawal,
  fetchListCityPartnerWithdrawalTotal,
  fetchListCityPartnerWithdrawalExport,
  fetchWithdrawGroupList,
} from '@/services/FinanceServices';

export default {
  namespace: 'withdrawDetail',

  state: {
    list: { list: [], total: 0 },
    listCash: { list: [], total: 0 },
    expertlist: { list: [], total: 0 },
    grouplist: { list: [], total: 0 },
    alliancelist: { list: [], total: 0 },
    totalData: { withdrawalFeeSum: 0, allWithdrawalFeeSum: 0, withdrawalHandlingFeeSum: 0 },
    expretTotalData: { withdrawalFeeSum: 0, allWithdrawalFeeSum: 0, withdrawalHandlingFeeSum: 0 },
    allianceTotalData: { withdrawalFeeSum: 0, allWithdrawalFeeSum: 0, withdrawalHandlingFeeSum: 0 },
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
      const response = yield call(fetchWithdrawList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchWithdrawGroupList({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawGroupList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          grouplist: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchWithdrawTotal({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content,
        },
      });
    },
    *fetchGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawExportExcel, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.merchantBeanWithdrawalList);
    },
    //单店现金列表
    *fetchGetCashList({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawManagementList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          listCash: { list: content.recordList, total: content.total },
        },
      });
    },
    //单店现金总和
    *fetchWithdrawCashTotal({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawManagementTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content,
        },
      });
    },
    //单店列表导出
    *fetchGetCashExcel({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawExportManagementExcel, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.merchantBeanWithdrawalList);
    },
    *fetchWithdrawSetRemark({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawSetRemark, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '备注设置成功',
      });
      callback();
    },
    *fetchWithdrawExpertList({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawExpertList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          expertlist: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchWithdrawExpertTotal({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawExpertTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          expretTotalData: content,
        },
      });
    },
    *fetchWithdrawExpertSetRemark({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawExpertSetRemark, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '备注设置成功',
      });
      callback();
    },
    // get 提现明细 - 加盟商提现 - 列表
    *fetchListCityPartnerWithdrawal({ payload }, { call, put }) {
      const response = yield call(fetchListCityPartnerWithdrawal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          alliancelist: { list: content.recordList, total: content.total },
        },
      });
    },
    // get 提现明细 - 加盟商提现 - 合计
    *fetchListCityPartnerWithdrawalTotal({ payload }, { call, put }) {
      const response = yield call(fetchListCityPartnerWithdrawalTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          allianceTotalData: content,
        },
      });
    },
    // 提现明细 - 加盟商提现 - 导出
    *fetchListCityPartnerWithdrawalExport({ payload, callback }, { call }) {
      const response = yield call(fetchListCityPartnerWithdrawalExport, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.directWithdrawalList);
    },
  },
};
