import { notification } from 'antd';
import {
  fetchAllRoleList,
  fetchAllSectionAdd,
  fetchAllSectionEdit,
  fetchWMSRoleDetail,
} from '@/services/SignAccountServices';

export default {
  namespace: 'roleSetting',

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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchAllRoleList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList || [],
          total: content.total,
        },
      });
    },
    *fetchWMSRoleDetail({ payload, callback }, { call }) {
      const response = yield call(fetchWMSRoleDetail, payload);
      if (!response) return;
      const { content } = response;
      const { permissionObjects } = content.authRoleDetail;
      const getData = (key, val) => {
        if (!permissionObjects.length) return [];
        return Object.assign(...permissionObjects.map((item) => ({ [item[key]]: item[val] })));
      };
      const selectedBtns = getData('accessIdString', 'buttons');
      const selectedDatas = getData('accessIdString', 'dataType');
      const selectedRowKeys = permissionObjects.map((item) => item.accessIdString);
      callback({
        ...content.authRoleDetail,
        roleId: content.authRoleDetail.roleIdString,
        selectedBtns,
        selectedDatas,
        selectedRowKeys,
      });
    },
    *fetchAllSectionAdd({ payload, callback }, { call }) {
      const response = yield call(fetchAllSectionAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '部门新增成功',
      });
      callback();
    },
    *fetchAllSectionEdit({ payload, callback }, { call }) {
      const response = yield call(fetchAllSectionEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '部门修改成功',
      });
      callback();
    },
  },
};
