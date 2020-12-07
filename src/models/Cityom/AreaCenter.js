import moment from 'moment';
import { notification } from 'antd';
import {
  fetchGetOcrLicense,
  fetchGetOcrBank,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
} from '@/services/BaseServices';
import {
  fetchAreaCenterList,
  fetchAreaDetail,
  fetchAreaAdd,
  fetchAreaEdit,
  fetchAreaBankSet,
  fetchAreaBankDetail,
} from '@/services/CityomServices';

export default {
  namespace: 'areaCenter',

  state: {
    list: { list: [], total: 0 },
    detail: {},
    bankDetail: {},
    partnerId: '',
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
        detail: {},
        bankDetail: {},
      };
    },
  },

  effects: {
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
      } = content.partnerDetail;
      const detail = {
        ...content.partnerDetail,
        entryDate: moment(entryDate),
        allAgentCityCode: [agentProvinceCode, agentCityCode, agentDistrictCode],
        allCityCode: [provinceCode, cityCode, districtCode],
      };
      yield put({
        type: 'save',
        payload: {
          partnerId: detail.partnerId,
          detail: detail,
        },
      });
      callback && callback();
    },
    *fetchAreaBankDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaBankDetail, payload);
      if (!response) return;
      const { content } = response;
      let detail = {};
      if (content.bankBindingInfoObject) {
        const { provCode, areaCode, startDate, legalCertIdExpires } = content.bankBindingInfoObject;
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
    *fetchAreaEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '区县公司信息修改成功',
      });
      callback();
    },
  },
};
