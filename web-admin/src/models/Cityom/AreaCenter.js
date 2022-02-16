import moment from 'moment';
import { notification } from 'antd';
import {
  fetchGetOcrLicense,
  fetchGetOcrBank,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
} from '@/services/PublicServices';
import {
  fetchAreaCenterList,
  fetchAreaDetail,
  fetchAreaAdd,
  fetchAreaEdit,
  fetchAreaAccountEdit,
  fetchAreaBankSet,
  fetchAreaBankDetail,
  fetchAreaBeanDetail,
} from '@/services/CityomServices';

export default {
  namespace: 'areaCenter',

  state: {
    list: { list: [], total: 0 },
    detail: {},
    bankDetail: {},
    partnerId: '',
    partnerAccountId: '',
    totalData: { list: [], total: 0 },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    close(state) {
      return {
        ...state,
        partnerId: '',
        partnerAccountId: '',
        detail: {},
        bankDetail: {},
        totalData: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchCloseData({ callback }, { put }) {
      yield put({
        type: 'close',
      });
      callback();
    },
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchAreaCenterList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchAreaBeanDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaBeanDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: { list: content.recordList, total: content.totalBean },
        },
      });
      callback(payload.year);
    },
    *fetchGetOcrLicense({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrLicense, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchGetOcrBank({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrBank, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchGetOcrFront({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrIdCardFront, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchGetOcrBefor({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrIdCardBack, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchAreaDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaDetail, payload);
      if (!response) return;
      const { content } = response;
      const {
        provinceCode,
        cityCode,
        districtCode,
        entryDate,
        agentProvinceCode,
        agentCityCode,
        agentDistrictCode,
        provinceName,
        cityName,
        districtName,
      } = content.partnerDetail;
      const detail = {
        ...content.partnerDetail,
        entryDate: moment(entryDate),
        allCityName: [provinceName, cityName, districtName],
        allAgentCityCode: [agentProvinceCode, agentCityCode, agentDistrictCode],
        allCityCode: [provinceCode, cityCode, districtCode],
        password: '',
      };
      yield put({
        type: 'save',
        payload: {
          partnerId: detail.partnerId,
          partnerAccountId: detail.partnerAccountId,
          detail: detail,
        },
      });
      callback && callback();
    },
    *fetchAreaBankDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaBankDetail, payload);
      if (!response) return;
      const { content } = response;
      let detail = { ...content };
      if (content.bankBindingObject) {
        const { provCode, areaCode, startDate, legalCertIdExpires } = content.bankBindingObject;
        detail = {
          ...content,
          activeDate: [moment(startDate), moment(legalCertIdExpires)],
          allCityCode: [provCode, areaCode],
        };
      }
      yield put({
        type: 'save',
        payload: {
          bankDetail: detail,
        },
      });
      callback && callback();
    },
    *fetchAreaAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaAdd, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          partnerId: content.partnerId,
        },
      });
      notification.success({
        message: '温馨提示',
        description: '区县公司新增成功',
      });
      callback();
    },
    *fetchAreaBankSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaBankSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '区县公司账户信息绑定成功',
      });
      callback();
    },
    *fetchAreaEdit({ payload, callback }, { call, put, select }) {
      const partnerAccountId = yield select((state) => state.areaCenter.partnerAccountId);
      const { partnerId, gender, email, account, password } = payload;
      const payloadAccont = { partnerId, partnerAccountId, gender, email, account, password };
      const response = yield call(fetchAreaEdit, payload);
      const response2 = yield call(fetchAreaAccountEdit, payloadAccont);
      if (!response || !response2) return;
      notification.success({
        message: '温馨提示',
        description: '区县公司信息修改成功',
      });
      yield put({
        type: 'close',
      });
      callback();
    },
  },
};
