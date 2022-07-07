import { notification } from 'antd';
import {
  fetchDivisionTemplateList,
  fetchDivisionTemplateDetail,
  fetchDivisionTemplateAdd,
  fetchDivisionTemplateUpdate,
} from '@/services/SystemServices';

export default {
  namespace: 'commissionTemplate',
  state: {
    list: [],
    total: 0,
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
    *fetchDivisionTemplateList({ payload }, { call, put }) {
      const response = yield call(fetchDivisionTemplateList, payload);
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
    *fetchDivisionTemplateDetail({ payload, callback }, { call }) {
      const response = yield call(fetchDivisionTemplateDetail, payload);
      if (!response) return;
      const { content } = response;

      const {
        differenceDivisionObjects = [],
        manualDivisionObjects = [],
        divisionTemplateType,
        categoryId,
        classifyId,
      } = content.divisionTemplate;
      //差价分佣
      let diffObj = {};
      differenceDivisionObjects.map((e) => {
        diffObj[e.divisionParticipantType] = e.divisionValue;
      });
      //手动分佣数据
      const manArr = manualDivisionObjects.map((items) => items.divisionParticipantType);
      callback({
        ...content.divisionTemplate,
        categoryIds: [categoryId],
        classifyIds: [classifyId],
        classifyId,
        differenceDivisionObjects: diffObj,
        manualDivisionObjects: manArr,
      });
    },
    *fetchDivisionTemplateAdd({ payload, callback }, { call }) {
      const response = yield call(fetchDivisionTemplateAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchDivisionTemplateUpdate({ payload, callback }, { call }) {
      const response = yield call(fetchDivisionTemplateUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
      });
      callback();
    },
  },
};
