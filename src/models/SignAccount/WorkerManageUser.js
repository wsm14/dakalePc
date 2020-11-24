import moment from 'moment';
import { notification } from 'antd';
import {
  fetchWMSUserList,
  fetchWMSUserRoles,
  fetchWMSUserDetail,
  fetchWMSUserAdd,
  fetchWMSUserEdit,
} from '@/services/SignAccountServices';

export default {
  namespace: 'workerManageUser',

  state: {
    list: [],
    total: 0,
    rolesList: [],
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state) {
      return {
        ...state,
        userInfo: {},
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchWMSUserList, payload);
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
    *fetchWMSUserRoles({ payload }, { call, put }) {
      const response = yield call(fetchWMSUserRoles, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          rolesList: content.recordList.map((item) => ({
            key: item.idString,
            title: item.roleName,
            description: item.roleName,
          })),
        },
      });
    },
    *fetchWMSUserDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchWMSUserDetail, payload);
      if (!response) return;
      const { content } = response;
      const { entryDate, departmentId } = content.sellDetail;
      callback({
        ...content.sellDetail,
        entryDate: moment(entryDate),
        departmentId: [departmentId],
      });
    },
    *fetchWMSUserAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWMSUserAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户新增成功',
      });
      callback();
    },
    *fetchWMSUserEdit({ payload, callback }, { call }) {
      const response = yield call(fetchWMSUserEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户修改成功',
      });
      callback();
    },
  },
};
