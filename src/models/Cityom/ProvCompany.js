import moment from 'moment';
import { notification } from 'antd';
import {
  fetchGetOcrLicense,
  fetchGetOcrBank,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
} from '@/services/BaseServices';
import {
  fetchProvList,
  fetchProvDetail,
  fetchProvAdd,
  fetchProvEdit,
  fetchProvAccountEdit,
  fetchProvBankSet,
  fetchProvBankDetail,
} from '@/services/CityomServices';

export default {
  namespace: 'provCompany',

  state: {
    list: { list: [], total: 0 },
    detail: {},
    bankDetail: {},
    companyId: '',
    companyAccountId: '',
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
        companyAccountId: '',
        companyId: '',
        detail: {},
        bankDetail: {},
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchProvList, payload);
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
    *fetchProvDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvDetail, payload);
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
      } = content.companyDetail;
      const detail = {
        ...content.companyDetail,
        entryDate: moment(entryDate),
        allCityName: [provinceName, cityName, districtName],
        allCityCode: [provinceCode, cityCode, districtCode],
        password: '',
      };
      yield put({
        type: 'save',
        payload: {
          companyAccountId: detail.companyAccountId,
          companyId: detail.companyId,
          detail: detail,
        },
      });
      callback && callback();
    },
    *fetchProvBankDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvBankDetail, payload);
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
    *fetchProvAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvAdd, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          companyId: content.companyId,
        },
      });
      notification.success({
        message: '温馨提示',
        description: '省公司新增成功',
      });
      callback();
    },
    *fetchProvBankSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvBankSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '省公司账户信息绑定成功',
      });
      callback();
    },
    *fetchProvEdit({ payload, callback }, { call, put, select }) {
      const companyAccountId = yield select((state) => state.provCompany.companyAccountId);
      const { companyId, gender, email, account, password } = payload;
      const payloadAccont = { companyId, companyAccountId, gender, email, account, password };
      const response = yield call(fetchProvEdit, payload);
      const response2 = yield call(fetchProvAccountEdit, payloadAccont);
      if (!response || !response2) return;
      notification.success({
        message: '温馨提示',
        description: '省公司信息修改成功',
      });
      yield put({
        type: 'close',
      });
      callback();
    },
  },
};
