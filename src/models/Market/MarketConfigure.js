import { notification } from 'antd';
import moment from 'moment';
import {
  fetchGlobalPopUpList,
  fetchGlobalPopUpAdd,
  fetchGlobalPopUpEdit,
  fetchGlobalPopUpConfigureDetail,
} from '@/services/MarketServices';

export default {
  namespace: 'marketConfigure',

  state: {
    modalEditionList: { list: [] },
    modalCityList: { list: [] },
    modalConfigureList: { list: [] },
    addParams: {},
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
      let { activityBeginTime, activityEndTime } = configGlobalPopUpDTO;

      activityBeginTime = activityBeginTime
        ? [moment(activityBeginTime), moment(activityEndTime)]
        : '';

      callback({ ...configGlobalPopUpDTO, activityBeginTime });
    },
  },
};
