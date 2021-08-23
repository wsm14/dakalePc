import { notification } from 'antd';
import moment from 'moment';
import {
  fetchInviteImgList,
  fetchInviteImgSave,
  fetchListFestivalConfig,
  fetchSaveFestivalConfig,
  fetchUpdateFestivalConfig,
  fetchFestivalConfigDetail,
  fetchFestivalConfigDown,
} from '@/services/SystemServices';

export default {
  namespace: 'globalConfig',

  state: {
    festivalConfigList: {
      list: [],
      total: 0,
    },
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
    *fetchInviteImgList({ payload, callback }, { call, put }) {
      const response = yield call(fetchInviteImgList, payload);
      if (!response) return;
      const { content = {} } = response;
      const list = { shareImg: content.shareImg };
      callback(list);
    },
    *fetchInviteImgSave({ payload, callback }, { call }) {
      const response = yield call(fetchInviteImgSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '图片上传成功',
      });
      callback();
    },
    *fetchListFestivalConfig({ payload }, { call, put }) {
      const response = yield call(fetchListFestivalConfig, payload);
      if (!response) return;
      const { content = {} } = response;
      yield put({
        type: 'save',
        payload: {
          festivalConfigList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchFestivalConfigDetail({ payload, callback }, { call }) {
      const response = yield call(fetchFestivalConfigDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      const { configFestivalDTO = {} } = content;
      const { configFestivalDetailDTOS = [], beginDay = '', endDay = '' } = configFestivalDTO;
      // topType
      // pickUpBeans 捡豆 // wanderAround 逛逛 // bottomIcon 底部icon
      // type
      // ["upperLeftCorner","lowerRightCornerCountdown","lowerRightCornerCountdownDynamic","topBackground","pickUpBeans","wanderAround","order","main"]

      const pickUpBeans = configFestivalDetailDTOS.filter((item) => item.topType === 'pickUpBeans');
      const wanderAround = configFestivalDetailDTOS.filter(
        (item) => item.topType == 'wanderAround',
      );
      const bottomIcon = configFestivalDetailDTOS.filter((item) => item.topType == 'bottomIcon');
      let pickObj = {};
      let wanderAObj = {};
      let bottomIconObj = {};
      //捡豆
      pickUpBeans.map((pickItem) => {
        switch (pickItem.type) {
          case 'upperLeftCorner':
            pickObj.upperLeftCorner = pickItem.image;
            pickObj.upperLeftCornerId = pickItem.configFestivalDetailId;
            break;
          case 'lowerRightCornerCountdown':
            pickObj.lowerRightCornerCountdown = pickItem.image;
            pickObj.lowerRightCornerCountdownId = pickItem.configFestivalDetailId;
            break;
          case 'lowerRightCornerCountdownDynamic':
            pickObj.lowerRightCornerCountdownDynamic = pickItem.image;
            pickObj.lowerRightCornerCountdownDynamicId = pickItem.configFestivalDetailId;
            pickObj.file = pickItem.file;
            break;
        }
      });
      //逛逛
      wanderAround.map((wandItem) => {
        switch (wandItem.type) {
          case 'topBackground':
            wanderAObj.topBackground = wandItem.image;
            wanderAObj.topBackgroundId = wandItem.configFestivalDetailId;
            break;
        }
      });

      //tabbarIcon
      bottomIcon.map((tabItem) => {
        switch (tabItem.type) {
          case 'pickUpBeans':
            bottomIconObj.pickUpBeans = tabItem.image;
            bottomIconObj.pickUpBeansId = tabItem.configFestivalDetailId;
            break;
          case 'wanderAround':
            bottomIconObj.wanderAround = tabItem.image;
            bottomIconObj.wanderAroundId = tabItem.configFestivalDetailId;
            break;
          case 'order':
            bottomIconObj.order = tabItem.image;
            bottomIconObj.orderId = tabItem.configFestivalDetailId;
            break;
          case 'main':
            bottomIconObj.main = tabItem.image;
            bottomIconObj.mainId = tabItem.configFestivalDetailId;
            break;
        }
      });

      const dateFormat = 'YYYY-MM-DD';
      const newDetails = {
        ...configFestivalDTO,
        pickUpBeans: pickObj,
        wanderAround: wanderAObj,
        bottomIcon: bottomIconObj,
        showTime: [moment(beginDay, dateFormat), moment(endDay, dateFormat)],
      };
      callback && callback(newDetails);
    },
    *fetchSaveFestivalConfig({ payload, callback }, { call }) {
      const response = yield call(fetchSaveFestivalConfig, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchUpdateFestivalConfig({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateFestivalConfig, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback();
    },
    *fetchFestivalConfigDown({ payload, callback }, { call }) {
      const response = yield call(fetchFestivalConfigDown, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '下架成功',
      });
      callback();
    },
  },
};
