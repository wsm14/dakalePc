import { notification } from 'antd';
import moment from 'moment';
import {
  fetchGlobalPopUpList,
  fetchGlobalPopUpAdd,
  fetchGlobalPopUpEdit,
  fetchGlobalPopUpConfigureDetail,
  fetchFloatingWindowList,
  fetchFloatingWindowAdd,
  fetchFloatingWindowEdit,
  fetchFloatingWindowDetail,
  fetchListConfigNewUserPopUp,
  fetchGetConfigNewUserPopUpById,
  fetchSaveConfigNewUserPopUp,
  fetchUpdateConfigNewUserPopUp,
  fetchGetWeeklyCard,
  fetchSetWeeklyCard,
} from '@/services/MarketServices';

export default {
  namespace: 'marketConfigure',

  state: {
    modalEditionList: { list: [] },
    modalCityList: { list: [] },
    modalConfigureList: { list: [] },
    floatEditionList: { list: [] },
    floatCityList: { list: [] },
    floatConfigureList: { list: [] },
    newUserPopUpList: { list: [] },
    weeklyCardObj: {},
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
    // get 周卡配置 - 详情
    *fetchGetWeeklyCard({ payload }, { call, put }) {
      const response = yield call(fetchGetWeeklyCard, payload);
      if (!response) return;
      const { content } = response;
      const { status, ...other } = content;

      yield put({
        type: 'save',
        payload: {
          weeklyCardObj: {
            status: Number(status),
            ...other,
          },
        },
      });
    },
    // post 周卡配置 - 编辑
    *fetchSetWeeklyCard({ payload, callback }, { call }) {
      const response = yield call(fetchSetWeeklyCard, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback && callback();
    },
    *fetchGlobalPopUpEditionList({ payload }, { call, put }) {
      const response = yield call(fetchGlobalPopUpList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          modalEditionList: { list: content.configGlobalPopUpDTOS },
        },
      });
    },
    *fetchGlobalPopUpAdd({ payload, callback }, { call }) {
      const response = yield call(fetchGlobalPopUpAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    //全局弹窗配置-修改版本-编辑配置-编辑权重-下架-删除
    *fetchGlobalPopUpEdit({ payload, callback }, { call }) {
      const response = yield call(fetchGlobalPopUpEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback();
    },
    *fetchGlobalPopUpCityList({ payload }, { call, put }) {
      const response = yield call(fetchGlobalPopUpList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          modalCityList: { list: content.configGlobalPopUpDTOS },
        },
      });
    },
    *fetchGlobalPopUpModalList({ payload }, { call, put }) {
      const response = yield call(fetchGlobalPopUpList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          modalConfigureList: { list: content.configGlobalPopUpDTOS },
        },
      });
    },
    //全局弹窗配置-详情
    *fetchGlobalPopUpConfigureDetail({ payload, callback }, { call }) {
      const response = yield call(fetchGlobalPopUpConfigureDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      const { configGlobalPopUpDTO = {} } = content;
      //开始时间和结束时间
      let { activityBeginTime, activityEndTime, param } = configGlobalPopUpDTO;

      activityBeginTime = activityBeginTime
        ? [moment(activityBeginTime), moment(activityEndTime)]
        : '';

      callback({ ...configGlobalPopUpDTO, activityBeginTime, param: JSON.parse(param || '{}') });
    },
    //浮窗配置 - 版本列表
    *fetchFloatingWindowList({ payload }, { call, put }) {
      const response = yield call(fetchFloatingWindowList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          floatEditionList: { list: content.configFloatingWindowDTOS },
        },
      });
    },
    //浮窗配置-新增版本-新增城市-新增版本-新增配置
    *fetchFloatingWindowAdd({ payload, callback }, { call }) {
      const response = yield call(fetchFloatingWindowAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    //浮窗配置-修改版本-编辑配置-编辑权重-下架-删除
    *fetchFloatingWindowEdit({ payload, callback }, { call }) {
      const response = yield call(fetchFloatingWindowEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback();
    },
    //浮窗配置 - 城市列表
    *fetchFloatingWindowCityList({ payload }, { call, put }) {
      const response = yield call(fetchFloatingWindowList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          floatCityList: { list: content.configFloatingWindowDTOS },
        },
      });
    },
    //浮窗配置 - 配置列表
    *fetchFloatingWindowConfigureList({ payload }, { call, put }) {
      const response = yield call(fetchFloatingWindowList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          floatConfigureList: { list: content.configFloatingWindowDTOS },
        },
      });
    },
    //全局弹窗配置-详情
    *fetchFloatingWindowConfigureDetail({ payload, callback }, { call }) {
      const response = yield call(fetchFloatingWindowDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      const { configFloatingWindowDTO = {} } = content;
      //开始时间和结束时间
      let { activityBeginTime, activityEndTime, param } = configFloatingWindowDTO;

      activityBeginTime = activityBeginTime
        ? [moment(activityBeginTime), moment(activityEndTime)]
        : '';

      callback({ ...configFloatingWindowDTO, activityBeginTime, param: JSON.parse(param || '{}') });
    },
    //新人福利弹窗 - 列表
    *fetchListConfigNewUserPopUp({ payload }, { call, put }) {
      const response = yield call(fetchListConfigNewUserPopUp, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          newUserPopUpList: { list: content.configNewUserPopUpDTOS },
        },
      });
    },
    //新人福利弹窗-详情
    *fetchGetConfigNewUserPopUpById({ payload, callback }, { call }) {
      const response = yield call(fetchGetConfigNewUserPopUpById, payload);
      if (!response) return;
      const { content = {} } = response;
      const { configNewUserPopUpDTO = {} } = content;
      const { activityBeginTime, activityEndTime, jumpUrlType, ...other } = configNewUserPopUpDTO;

      const data = {
        ...other,
        jumpType: jumpUrlType,
        activityBeginTime: [
          moment(activityBeginTime, 'YYYY-MM-DD HH:mm'),
          moment(activityEndTime, 'YYYY-MM-DD HH:mm'),
        ],
      };

      callback && callback(data);
    },
    // post 新人福利弹窗 - 新增
    *fetchSaveConfigNewUserPopUp({ payload, callback }, { call }) {
      const response = yield call(fetchSaveConfigNewUserPopUp, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback && callback();
    },
    // post 新人福利弹窗 - 编辑
    *fetchUpdateConfigNewUserPopUp({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateConfigNewUserPopUp, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback && callback();
    },
  },
};
