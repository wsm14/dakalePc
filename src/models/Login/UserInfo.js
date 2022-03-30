import { notification } from 'antd';
import lodash from 'lodash';
import { fetchQueryCurrent, fetchGetAuthMenuTree } from '@/services/LoginServices';
import { fetchPassWordEdit } from '@/services/BaseServices';

export default {
  namespace: 'userInfo',
  state: {
    currentUser: {},
    flag: 0,
    menuList: [], // 用户菜单列表
    menuBtn: {},
    menuNameObj: {},
    loading: true,
    openedMenu: [], // 保存已经打开的菜单栏 用于顶部tab
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload || {} };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveOpenMenu(state, { payload }) {
      const { menuItem } = payload;
      if (!state.openedMenu.find((i) => i.path === menuItem.path)) {
        const openedMenu = [...state.openedMenu];
        openedMenu.push(menuItem);
        return { ...state, openedMenu };
      }
      return state;
    },
    filterKey(state, { payload }) {
      const openedMenu = state.openedMenu.filter((i) => i.path !== payload.key);
      if (state.openedMenu.length === openedMenu.length) {
        return state;
      }
      return { ...state, openedMenu };
    },
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(fetchQueryCurrent);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'saveCurrentUser',
        payload: content.adminInfo,
      });
    },
    *fetchPassWordEdit({ payload }, { call }) {
      const response = yield call(fetchPassWordEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改密码成功',
      });
    },
    *fetchGetAuthMenuTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetAuthMenuTree, payload);
      if (!response) return;
      const { content } = response;
      const { flag, permissionTree = [] } = content;
      if (flag == 0 && permissionTree.length === 0) {
        notification.warning({
          message: '温馨提示',
          description: '权限不足，请通知管理员配置角色菜单',
        });
        return;
      }
      const btnObj = {};
      const urlObj = {};
      const duplicate = (item) => {
        urlObj[item.accessUrl] = item.accessName;
        if (item.buttons && item.buttons.length) btnObj[item.accessUrl] = item.buttons;
        if (item.childList && item.childList.length) {
          lodash.flatMap(item.childList, duplicate);
        }
      };
      lodash.flatMap(content.permissionTree, duplicate);
      yield put({
        type: 'save',
        payload: {
          flag: Number(content.flag),
          menuList: content.permissionTree,
          menuBtn: btnObj,
          menuNameObj: urlObj,
          loading: false,
        },
      });
      callback && callback(content.permissionTree);
    },
  },
};
