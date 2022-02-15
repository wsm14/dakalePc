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
        // totalData: { list: [], total: 0 },
      };
    },
  },

  effects: {
    // 市级公司列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchCityList, payload);
      // if (!response) return;
      // const { content } = response;

      const content = {
        total: 1,
        recordList: [
          {
            agentCityCode: '3301',
            agentCityName: '杭州',
            cityCode: '3301',
            cityId: '1',
            cityName: '杭州',
            companyName: '哒卡乐城市代理',
            contactMobile: '15555555555',
            contactPerson: '孙贝贝',
            districtCode: '330109',
            districtName: '萧山区',
            entryDate: '2021-07-22',
            merchantCount: 905,
            provinceCode: '33',
            provinceName: '浙江',
            status: '1',
          },
        ],
      };
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
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
      } = content.cityDetail;
      const detail = {
        ...content.cityDetail,
        entryDate: moment(entryDate),
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
  },
};
