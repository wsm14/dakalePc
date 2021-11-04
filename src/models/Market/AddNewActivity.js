import { notification } from 'antd';
import {
  fetchMarketAddNewActivity,
  fetchMarketAddNewActivityDetail,
} from '@/services/MarketServices';

export default {
  namespace: 'addNewActivity',

  state: {
    list: [],
    // radioType: { user: {}, merchant: {}, weChat: {} },
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
    // 获取裂变模板-列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMarketAddNewActivity, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.configFissionTemplateDTOS,
        },
      });
    },
    *fetchMarketAddNewActivityDetail({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityDetail, payload);
      if (!response) return;
      const { content } = response;
      // const {
      //   param,
      //   hideTitle = false,
      //   provinceCityDistrictObjects: cityData = [],
      // } = content.configFissionTemplateDTO;
      callback(content.configFissionTemplateDTO);
      //   callback({
      //     ...content.bannerDTO,
      //     provinceCityDistrictObjects: cityData.map(({ provinceCode, cityCode, districtCode }) => ({
      //       city: [provinceCode, cityCode, districtCode].filter((i) => i),
      //     })),
      //     param: JSON.parse(param || '{}'),
      //     hideTitle: !Number(hideTitle),
      //   });
    },
    // *fetchGetList({ payload }, { call, put }) {
    //   const response = yield call(fetchBannerList, payload);
    //   if (!response) return;
    //   const { content } = response;
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       list: content.recordList,
    //       total: content.total,
    //     },
    //   });
    // },
    // *fetchBannerRatio({ payload }, { call, put }) {
    //   const response = yield call(fetchBannerRatio, payload);
    //   if (!response) return;
    //   const { content } = response;
    //   let dataObj = {};
    //   content.banner.bannerPictureResolutionConfigs.forEach((item) => {
    //     let newObj = {};
    //     item.pictureResolutionConfigs.forEach((it) => {
    //       newObj[it.bannerType] = it.height / it.width;
    //     });
    //     dataObj[item.terminalType] = newObj;
    //   });
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       radioType: dataObj,
    //     },
    //   });
    // },
    // *fetchBannerDetail({ payload, callback }, { call }) {
    //   const response = yield call(fetchBannerDetail, payload);
    //   if (!response) return;
    //   const { content } = response;
    //   const {
    //     param,
    //     hideTitle = false,
    //     provinceCityDistrictObjects: cityData = [],
    //   } = content.bannerDTO;
    //   callback({
    //     ...content.bannerDTO,
    //     provinceCityDistrictObjects: cityData.map(({ provinceCode, cityCode, districtCode }) => ({
    //       city: [provinceCode, cityCode, districtCode].filter((i) => i),
    //     })),
    //     param: JSON.parse(param || '{}'),
    //     hideTitle: !Number(hideTitle),
    //   });
    // },
    // *fetchBannerEdit({ payload, callback }, { call }) {
    //   const response = yield call(fetchBannerEdit, payload);
    //   if (!response) return;
    //   notification.success({
    //     message: '温馨提示',
    //     description: `占位图修改成功`,
    //   });
    //   callback();
    // },
    // *fetchBannerStatus({ payload, callback }, { call }) {
    //   const response = yield call(fetchBannerStatus, payload);
    //   if (!response) return;
    //   const { bannerStatus } = payload;
    //   const text = ['下架', '上架'][bannerStatus];
    //   notification.success({
    //     message: '温馨提示',
    //     description: `占位图${text ? text : '删除'}成功`,
    //   });
    //   callback();
    // },
    // *fetchBannerSet({ payload, callback }, { call }) {
    //   const response = yield call(fetchBannerSet, payload);
    //   if (!response) return;
    //   notification.success({
    //     message: '温馨提示',
    //     description: '占位图新增成功',
    //   });
    //   callback();
    // },
  },
};
