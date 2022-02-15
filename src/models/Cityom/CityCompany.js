import moment from 'moment';
import { notification } from 'antd';
import {
  fetchGetOcrLicense,
  fetchGetOcrBank,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
} from '@/services/PublicServices';
import { fetchCityList, fetchCityAdd } from '@/services/CityomServices';

export default {
  namespace: 'cityCompany',

  state: {
    list: { list: [], total: 0 },
    cityId: '',
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
    // 市级公司列表
    *fetchGetList({ payload }, { call, put }) {
      // const response = yield call(fetchCityList, payload);
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
  },
};
