import moment from 'moment';
import { notification } from 'antd';
import {
  fetchSupplierEnable,
  fetchSupplierDisable,
  fetchSupplierManageAdd,
  fetchSupplierManageEdit,
  fetchSupplierCorpAccount,
  fetchSupplierPersonAccount,
  fetchGetSupplierManageList,
  fetchGetSupplierManageDetail,
} from '@/services/SCMServices';

export default {
  namespace: 'supplierManage',

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
      const response = yield call(fetchGetSupplierManageList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.supplierDetailList,
          total: content.total,
        },
      });
    },
    *fetchGetSupplierManageDetail({ payload, callback }, { call, put }) {
      const { mode, ...other } = payload;
      const response = yield call(fetchGetSupplierManageDetail, other);
      if (!response) return;
      const { content } = response;
      let detailData = content.supplierDetail || {};
      if (mode === 'edit') {
        const {
          provinceCode,
          cityCode,
          districtCode,
          classifyIds,
          proofInfoObject,
          ...other
        } = detailData;
        const { establishDate, validityPeriod } = proofInfoObject;
        detailData = {
          ...other,
          activeValidity: [moment(establishDate), moment(validityPeriod)],
          proofInfoObject,
          classifyIds: classifyIds.split(','),
          allCode: [provinceCode, cityCode, districtCode],
        };
      }
      callback(detailData);
    },
    *fetchSupplierManageSet({ payload, callback }, { call, put }) {
      const { mode, ...other } = payload;
      // add 新增 edit 修改
      const fetchApi = { add: fetchSupplierManageAdd, edit: fetchSupplierManageEdit }[mode];
      const fetchText = { add: '创建', edit: '修改' }[mode];
      const response = yield call(fetchApi, other);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `${fetchText}审核已提交`,
      });
      callback();
    },
    *fetchSupplierActivateAccount({ payload, callback }, { call, put }) {
      const { bankAccount, ...other } = payload;
      // 1 对公 2 对私
      const fetchApi = [false, fetchSupplierCorpAccount, fetchSupplierPersonAccount][bankAccount];
      const response = yield call(fetchApi, other);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '审核已提交',
      });
      callback();
    },
    *fetchSupplierEnable({ payload, callback }, { call, put }) {
      const response = yield call(fetchSupplierEnable, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '启用成功',
      });
      callback();
    },
    *fetchSupplierDisable({ payload, callback }, { call, put }) {
      const response = yield call(fetchSupplierDisable, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '禁用成功',
      });
      callback();
    },
  },
};
