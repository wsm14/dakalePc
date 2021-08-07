import { notification } from 'antd';
import moment from 'moment';
import {
  fetchGetOcrLicense,
  fetchGetOcrBank,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
  fetchGetOcrIdBankCard,
} from '@/services/PublicServices';
import {
  fetchMerchantGroup,
  fetchAddMerchantGroup,
  fetchMerchantBank,
  fetchGrounpDetails,
  fetchUpdateGroup,
  fetchCrmGrounpList,
  fetchGroupStoreList,
  fetchGroupSetBandCode,
  fetchRateByCategory,
} from '@/services/BusinessServices';

export default {
  namespace: 'groupSet',
  state: {
    list: { list: [], total: 0 },
    storeList: { list: [] },
    crmList: [],
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
        crmList: [],
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
          list: { list: content.recordList || [], total: content.total },
        },
      });
    },
    *fetchCrmGrounpList({ payload }, { call, put }) {
      const response = yield call(fetchCrmGrounpList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          crmList: content.merchantGroupList,
        },
      });
    },
    *fetchGroupStoreList({ payload }, { call, put }) {
      const response = yield call(fetchGroupStoreList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          storeList: { list: content.merchantList || [] },
        },
      });
    },
    *fetchAddList({ payload, callback }, { call, put }) {
      const response = yield call(fetchAddMerchantGroup, payload);
      if (!response) return;
      const { content } = response;
      notification.success({
        message: '温馨提示',
        description: '添加成功',
      });
      callback && callback(content.merchantGroupId);
    },
    *fetchGroupSetBandCode({ payload }, { call, put }) {
      const response = yield call(fetchGroupSetBandCode, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '开户行号设置成功',
      });
    },
    *fetchGetOcrBusinessLicense({ payload, callback }, { call }) {
      const response = yield call(fetchGetOcrLicense, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchGetOcrBankLicense({ payload, callback }, { call }) {
      const response = yield call(fetchGetOcrBank, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchGetOcrIdCardFront({ payload, callback }, { call }) {
      const response = yield call(fetchGetOcrIdCardFront, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchGetOcrIdCardBack({ payload, callback }, { call }) {
      const response = yield call(fetchGetOcrIdCardBack, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchGetOcrIdBankCard({ payload, callback }, { call }) {
      const response = yield call(fetchGetOcrIdBankCard, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchRateByCategory({ payload, callback }, { call }) {
      const response = yield call(fetchRateByCategory, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchMerchantBank({ payload, callback }, { call }) {
      const response = yield call(fetchMerchantBank, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '添加成功',
      });
      const { content } = response;
      callback && callback(content);
    },
    *fetchGrounpDetails({ payload, callback }, { call }) {
      const response = yield call(fetchGrounpDetails, payload);
      if (!response) return;
      const {
        content: { bankBindingInfo = {}, businessLicense = {}, merchantGroupDTO: mInfo = {} },
      } = response;
      const { startDate, legalCertIdExpires, ...bankOther } = bankBindingInfo;
      const { establishDate: mre, validityPeriod, ...blsOther } = businessLicense;
      const activeBeginDate = startDate ? [moment(startDate), moment(legalCertIdExpires)] : ''; // 结算人/法人 身份有效期
      const establishDate = mre ? [moment(mre), moment(validityPeriod)] : ''; // 营业期限
      const city = bankBindingInfo.areaCode
        ? [parseInt(bankBindingInfo.provCode).toString(), bankBindingInfo.areaCode]
        : undefined;
      const allCode = [mInfo.provinceCode, mInfo.cityCode, mInfo.districtCode]; // 城市code
      const topCategSelect = [mInfo.topCategoryIdString, mInfo.categoryIdStr]; // 经营项目
      callback({
        ...bankOther,
        ...blsOther,
        ...mInfo,
        businessLicenseObject: businessLicense,
        topCategSelect,
        sellMerchantGroupId: mInfo.merchantGroupIdString,
        topCategoryId: mInfo.topCategoryIdString,
        categoryId: mInfo.categoryIdStr,
        activeValidity: establishDate,
        activeBeginDate,
        city,
        allCode,
        videoUrl: mInfo?.videoContentOb?.url,
        videoId: mInfo?.videoContentOb?.videoId,
      });
    },
    *fetchUpdateGroup({ payload, callback }, { call }) {
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
