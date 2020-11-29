import { notification } from 'antd';
import {
  fetchAllGetMenu,
  fetchAllRoleList,
  fetchAllGetRoleFlag,
  fetchAllRoleSelect,
  fetchAllRoleAdd,
  fetchAllRoleEdit,
  fetchAllUserRoleDetail,
  fetchAllGetRoleDetail,
} from '@/services/SignAccountServices';

// 递归树菜单
const userMenuDataTree = (menu, key, pid = '0') => {
  let ch = '';
  const children = menu.filter((i) => pid === i.pidString);
  if (!children.length) return false;
  const getMenuItem = (menuItem) => {
    ch = userMenuDataTree(menu, key, menuItem[key]);
    return {
      ...menuItem,
      accessIdString: menuItem[key],
      children: ch ? ch.filter((i) => i) : false,
    };
  };
  return menu
    .map((item) => {
      if (item.pidString == '0' && pid == '0') {
        const localItem = getMenuItem(item);
        return localItem;
      } else if (item.pidString != '0' && pid != '0' && pid === item.pidString) {
        const childrens = getMenuItem(item);
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
    serverMenu: [],
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
    *fetchGetMenuAll({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllGetMenu, payload);
      if (!response) return;
      const { content } = response;
      const newList = userMenuDataTree(content.accessList, 'authAccessId');
      yield put({
        type: 'save',
        payload: {
          serverMenu: newList,
        },
      });
      callback && callback();
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
    *fetchAllUserRoleDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllUserRoleDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userMenu: userMenuDataTree(content.permissionObjectList, 'accessIdString'),
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
    *fetchAllRoleAdd({ payload, callback }, { call }) {
      const response = yield call(fetchAllRoleAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色新增成功',
      });
      callback();
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
  },
};
