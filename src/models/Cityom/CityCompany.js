import moment from 'moment';
import { notification } from 'antd';
import {
  fetchGetOcrLicense,
  fetchGetOcrBank,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
} from '@/services/PublicServices';
import {
  fetchCityList,
  fetchCityAdd,
  fetchCityBankSet,
  fetchCityDetail,
  fetchCityBankDetail,
  fetchCityEdit,
  fetchCityAccountEdit,
  fetchCityManageDistrictSet,
} from '@/services/CityomServices';

export default {
  namespace: 'cityCompany',

  state: {
    list: { list: [], total: 0 },
    cityId: '',
    detail: {},
    bankDetail: {},
    cityAccountId: '',
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
        cityId: '',
        detail: {},
        bankDetail: {},
        cityAccountId: '',
      };
    },
  },

  effects: {
    // 清楚数据
    *fetchCloseData({ callback }, { put }) {
      yield put({
        type: 'close',
      });
      callback && callback();
    },
    // 市级公司列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchCityList, payload);
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
    // 市级公司  新增
    *fetchCityAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityAdd, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          cityId: content.cityId,
        },
      });
      notification.success({
        message: '温馨提示',
        description: '市级公司新增成功',
      });
      callback && callback();
    },
    // post 市公司 - 设置绑定账户信息
    *fetchCityBankSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityBankSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '市级公司账户信息绑定成功',
      });
      callback && callback();
    },
    // 获取市级公司详情
    *fetchCityDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityDetail, payload);
      if (!response) return;
      const { content } = response;
      const {
        provinceCode,
        cityCode,
        districtCode,
        provinceName,
        cityName,
        districtName,
        entryDate,
        agentCityCode,
      } = content.cityDetail;
      const detail = {
        ...content.cityDetail,
        entryDate: moment(entryDate),
        agentCityCode: [agentCityCode.slice(0, 2), agentCityCode],
        allCityName: [provinceName, cityName, districtName],
        allCityCode: [provinceCode, cityCode, districtCode],
        password: '',
      };
      yield put({
        type: 'save',
        payload: {
          cityAccountId: detail.cityAccountId,
          cityId: detail.cityId,
          detail: detail,
        },
      });
      callback && callback();
    },
    // 获取账户信息详情
    *fetchCityBankDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityBankDetail, payload);
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
    // 修改市级公司信息
    *fetchCityEdit({ payload, callback }, { call, put, select }) {
      const cityAccountId = yield select((state) => state.cityCompany.cityAccountId);
      const { cityId, gender, email, account, password, status } = payload;
      const payloadAccont = {
        status: status == '1' ? '0' : '1',
        cityId,
        cityAccountId,
        gender,
        email,
        account,
        password,
      };
      const response = yield call(fetchCityEdit, payload);
      const response2 = yield call(fetchCityAccountEdit, payloadAccont);
      if (!response || !response2) return;
      notification.success({
        message: '温馨提示',
        description: '市级公司信息修改成功',
      });
      yield put({
        type: 'close',
      });
      callback && callback();
    },
    // post 市公司列表 - 设置可管理区县
    *fetchCityManageDistrictSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityManageDistrictSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '可管理区县设置成功',
      });
      callback && callback();
    },
  },
};
