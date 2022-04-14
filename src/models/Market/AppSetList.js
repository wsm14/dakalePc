import { notification } from 'antd';
import moment from 'moment';
import {
  fetchBannerList,
  fetchBannerDetail,
  fetchBannerRatio,
  fetchBannerSet,
  fetchBannerEdit,
  fetchBannerStatus,
  fetchSaveConfigBannerType,
} from '@/services/MarketServices';

export default {
  namespace: 'sysAppList',

  state: {
    versionList: { list: [], total: 0 },
    cityList: { list: [], total: 0 },
    configureList: { list: [], total: 0 },
    radioType: { user: {}, merchant: {}, weChat: {}, markMain: {} },
    bannerTypeObj: {},
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
      const response = yield call(fetchBannerList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          versionList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchGetCityList({ payload }, { call, put }) {
      const response = yield call(fetchBannerList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          cityList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchGetConfigureList({ payload }, { call, put }) {
      const response = yield call(fetchBannerList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          configureList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    // get banner管理 - banner图片位置+banner图片分辨率 -列表
    *fetchBannerRatio({ payload }, { call, put }) {
      const response = yield call(fetchBannerRatio, payload);
      if (!response) return;
      const { content } = response;

      let bannerTypeObj = {}; // banner图片位置
      let dataObj = {}; // banner图片尺寸
      content.configBannerTypeDTOS.forEach((item) => {
        bannerTypeObj[item.type] = item.desc;
        dataObj[item.type] = item.width / item.height;
      });

      yield put({
        type: 'save',
        payload: {
          bannerTypeObj,
          radioType: dataObj,
        },
      });
    },
    *fetchBannerDetail({ payload, callback }, { call }) {
      const { type = 'add', ...other } = payload;
      const response = yield call(fetchBannerDetail, { ...other });
      if (!response) return;
      const { content } = response;
      const {
        param,
        hideTitle = false,
        provinceCityDistrictObjects: cityData = [],
        beginDate,
        endDate,
      } = content.bannerDTO;
      const data = {
        ...content.bannerDTO,
        beginDate,
        endDate,
        activityTime:
          type === 'up' ? [] : [moment(beginDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        provinceCityDistrictObjects: cityData.map(({ provinceCode, cityCode, districtCode }) => ({
          city: [provinceCode, cityCode, districtCode].filter((i) => i),
        })),
        param: JSON.parse(param || '{}'),
        hideTitle: !Number(hideTitle),
      };
      callback && callback(data);
    },
    *fetchBannerEdit({ payload, callback }, { call }) {
      const response = yield call(fetchBannerEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `修改成功`,
      });
      callback();
    },
    *fetchBannerStatus({ payload, callback }, { call }) {
      const response = yield call(fetchBannerStatus, payload);
      if (!response) return;
      const { bannerStatus } = payload;
      const text = ['下架', '上架'][bannerStatus];
      notification.success({
        message: '温馨提示',
        description: `${text ? text : '删除'}成功`,
      });
      callback();
    },
    *fetchBannerSet({ payload, callback }, { call }) {
      const response = yield call(fetchBannerSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    // post banner管理 - banner图片位置 - 新增
    *fetchSaveConfigBannerType({ payload, callback }, { call }) {
      const response = yield call(fetchSaveConfigBannerType, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: 'banner图片位置新增成功',
      });
      callback && callback();
    },
  },
};
