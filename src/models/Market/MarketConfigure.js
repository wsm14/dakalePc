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
  },
};
