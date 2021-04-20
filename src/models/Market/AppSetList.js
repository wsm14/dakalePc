import { notification } from 'antd';
import moment from 'moment';
import {
  fetchBannerList,
  fetchBannerDetail,
  fetchBannerRatio,
  fetchBannerSet,
  fetchBannerEdit,
  fetchBannerStatus,
} from '@/services/MarketServices';

export default {
  namespace: 'sysAppList',

  state: {
    list: [],
    total: 0,
    radioType: { user: {}, merchant: {}, weChat: {} },
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
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchBannerRatio({ payload }, { call, put }) {
      const response = yield call(fetchBannerRatio, payload);
      if (!response) return;
      const { content } = response;
      let dataObj = {};
      content.banner.bannerPictureResolutionConfigs.forEach((item) => {
        let newObj = {};
        item.pictureResolutionConfigs.forEach((it) => {
          newObj[it.bannerType] = it.height / it.width;
        });
        dataObj[item.terminalType] = newObj;
      });
      yield put({
        type: 'save',
        payload: {
          radioType: dataObj,
        },
      });
    },
    *fetchBannerDetail({ payload, callback }, { call }) {
      const response = yield call(fetchBannerDetail, payload);
      if (!response) return;
      const { content } = response;
      const {
        jumpUrlType,
        beginDate,
        endDate,
        param,
        provinceCityDistrictObjects: cityData = [],
      } = content.bannerDTO;
      callback({
        ...content.bannerDTO,
        provinceCityDistrictObjects: cityData.map(({ provinceCode, cityCode, districtCode }) => ({
          city: [provinceCode, cityCode, districtCode].filter((i) => i),
        })),
        jumpUrlType: jumpUrlType ? jumpUrlType : '无',
        param: JSON.parse(param || '{}'),
        beginDate: [moment(beginDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
      });
    },
    *fetchBannerEdit({ payload, callback }, { call }) {
      const response = yield call(fetchBannerEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `占位图修改成功`,
      });
      callback();
    },
    *fetchBannerStatusDel({ payload, callback }, { call }) {
      const response = yield call(fetchBannerStatus, payload);
      if (!response) return;
      const { bannerStatus } = payload;
      notification.success({
        message: '温馨提示',
        description: `占位图${bannerStatus === 0 ? '下架' : '删除'}成功`,
      });
      callback();
    },
    *fetchBannerSet({ payload, callback }, { call }) {
      const response = yield call(fetchBannerSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '占位图新增成功',
      });
      callback();
    },
  },
};
