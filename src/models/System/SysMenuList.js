import { notification } from 'antd';
import { fetchMenuList, fetchGetMenuDetail, fetchMenuSet } from '@/services/SystemServices';

// 菜单
const menuDataTree = (menu, pid = '0') => {
  let ch = '';
  const children = menu.filter((i) => pid === i.pidString);
  if (!children.length) return false;
  return menu
    .map((item) => {
      if (item.pidString === '0' && pid === '0') {
        ch = menuDataTree(menu, item.authAccessId);
        const localItem = {
          ...item,
          children: ch ? ch.filter((i) => i) : false,
        };
        return localItem;
      } else if (item.pidString !== '0' && pid !== '0' && pid === item.pidString) {
        ch = menuDataTree(menu, item.authAccessId);
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
  namespace: 'sysMenuList',

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
      const response = yield call(fetchMenuList, payload);
      if (!response) return;
      const { content } = response;
      const newList = menuDataTree(content.accessList);
      yield put({
        type: 'save',
        payload: {
          list: newList,
          total: content.accessList.length,
        },
      });
    },
    *fetchGetMenuDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetMenuDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.accessInfo);
    },
    *fetchMenuSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMenuSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '菜单设置成功',
      });
      callback();
    },
  },
};
