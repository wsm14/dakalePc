import { notification } from 'antd';
import {
  fetchAllRoleList,
  fetchAllRoleSelect,
  fetchAllRoleEdit,
  fetchAllUserRoleDetail,
  fetchAllGetRoleDetail,
  fetchAllGetRoleFlag,
} from '@/services/SignAccountServices';

// 递归树菜单
const userMenuDataTree = (menu, pid = '0') => {
  let ch = '';
  const children = menu.filter((i) => pid === i.pidString);
  if (!children.length) return false;
  return menu
    .map((item) => {
      if (item.pidString == '0' && pid == '0') {
        ch = userMenuDataTree(menu, item.accessIdString);
        const localItem = {
          ...item,
          children: ch ? ch.filter((i) => i) : false,
        };
        return localItem;
      } else if (item.pidString != '0' && pid != '0' && pid === item.pidString) {
        ch = userMenuDataTree(menu, item.accessIdString);
        const childrens = {
          ...item,
          children: ch ? ch.filter((i) => i) : false,
        };
        return childrens;
      }
    })
    .filter((i) => i);
};

export default {
  namespace: 'roleSetting',

  state: {
    list: [],
    total: 0,
    userMenu: [],
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
    *fetchAllRoleSelect({ payload, callback }, { call }) {
      const response = yield call(fetchAllRoleSelect, payload);
      if (!response) return;
      const { content } = response;
      callback &&
        callback(
          content.recordList.map((item) => ({
            key: item.idString,
            title: item.roleName,
            description: item.roleName,
          })),
        );
    },
    *fetchAllRoleEdit({ payload, callback }, { call }) {
      const response = yield call(fetchAllRoleEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色修改成功',
      });
      callback();
    },
    *fetchAllUserRoleDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllUserRoleDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userMenu: userMenuDataTree(content.permissionObjectList),
        },
      });
      callback();
    },
    *fetchAllGetRoleFlag({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllGetRoleFlag, payload);
      if (!response) return;
      const { content } = response;
      callback(content.flag);
    },
    *fetchAllGetRoleDetail({ payload, callback }, { call }) {
      const response = yield call(fetchAllGetRoleDetail, payload);
      if (!response) return;
      const { content } = response;
      const { permissionObjects } = content.authRoleDetail;
      const getData = (key, val) => {
        if (permissionObjects && !permissionObjects.length) return [];
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
  },
};
