import { notification } from 'antd';
import {
  fetchWMSRoleList,
  fetchWMSRoleDetail,
  fetchWMSRoleAdd,
  fetchWMSRoleEdit,
} from '@/services/SystemServices';

export default {
  namespace: 'roleProvinceArea',

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
      const response = yield call(fetchWMSRoleList, payload);
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
        selectedPKeys: [],
        selectedRowKeys,
      });
    },
    *fetchWMSRoleAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWMSRoleAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色新增成功',
      });
      callback();
    },
    *fetchWMSRoleEdit({ payload, callback }, { call }) {
      const response = yield call(fetchWMSRoleEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色修改成功',
      });
      callback();
    },
  },
};
