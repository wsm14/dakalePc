import { notification } from 'antd';
import moment from 'moment';
import {
  fetchMerchantGroup,
  fetchAddMerchantGroup,
  fetchGetOcrBankLicense,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
  fetchGetOcrBusinessLicense,
  fetchMerchantBank,
  fetchWMSUserRoles,
  fetchGrounpDetails,
  fetchUpdateGroup,
} from '@/services/BusinessServices';

export default {
  namespace: 'groupSet',
  state: {
    list: { list: [], total: 0 },
    visible: false,
    visible1: false,
    visible2: false,
    rolesList: [],
    groupDetails: {},
    merchantGroupDTO: {},
    businessLicense: {},
    bankBindingInfo: {},
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
      const response = yield call(fetchMerchantGroup, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList || [],total:content.total},
        },
      });
    },
    *fetchWMSUserRoles({ payload }, { call, put }) {
      const response = yield call(fetchWMSUserRoles, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          rolesList: content.recordList.map((item) => ({
            key: item.idString,
            title: item.roleName,
            description: item.roleName,
          })),
        },
      });
    },
    *fetchAddList({ payload, callback }, { call, put }) {
      const response = yield call(fetchAddMerchantGroup, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          merchantGroupId: content.merchantGroupId,
        },
      });
      notification.success({
        message: '温馨提示',
        description: '添加成功',
      });
      callback && callback();
    },
    *fetchGetOcrBusinessLicense({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrBusinessLicense, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchGetOcrBankLicense({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrBankLicense, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchGetOcrIdCardFront({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrIdCardFront, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchGetOcrIdCardBack({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrIdCardBack, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchMerchantBank({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantBank, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '添加成功',
      });
      const { content } = response;
      callback && callback(content);
    },
    *fetchGrounpDetails({ payload, callback }, { call, put }) {
      const response = yield call(fetchGrounpDetails, payload);
      if (!response) return;
      const { content } = response;
      let activeBeginDate = [];
      if (content.bankBindingInfo) {
        activeBeginDate = [
          moment(content.bankBindingInfo.startDate),
          moment(content.bankBindingInfo.legalCertIdExpires),
        ];
      }
      yield put({
        type: 'save',
        payload: {
          groupDetails: { ...content },
          merchantGroupDTO:
            {
              ...content.merchantGroupDTO,
              topCategSelect: content.merchantGroupDTO.categoryNode.split('.'),
              allCode: [content.merchantGroupDTO.provinceCode,content.merchantGroupDTO.cityCode,content.merchantGroupDTO.districtCode],
            } || {},
          businessLicense: content.businessLicense || {},
          bankBindingInfo:
            {
              ...content.bankBindingInfo,
              activeBeginDate,
            } || {},
        },
      });
      callback && callback();
    },
    *fetchUpdateGroup({ payload, callback }, { call, put }) {
      const response = yield call(fetchUpdateGroup, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
      });
      callback && callback();
    },
  },
};
