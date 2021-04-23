import { notification } from 'antd';
import update from 'immutability-helper';
import {
  fetchExpertAllocationList,
  fetchExpertAllocationSave,
  fetchExpertAllocationEdit,
} from '@/services/SystemServices';

export default {
  namespace: 'expertAllocation',

  state: {
    list: [],
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
      const response = yield call(fetchExpertAllocationList, payload);
      if (!response) return;
      const { content } = response;
      const { userLevelList } = content;
      const normalRow = userLevelList.findIndex((item) => item.type === 'normal');
      const movefile = update(content.userLevelList, {
        $splice: [
          [normalRow, 1],
          [0, 0, userLevelList[normalRow]],
        ],
      });
      yield put({
        type: 'save',
        payload: {
          list: movefile.map((item) => {
            let obj = {
              children: item.configUserLevelList.map((ite) => ({
                ...ite,
                levelKey: item.type,
              })),
            };
            if (item.type === 'normal')
              obj = {
                ...item.configUserLevelList[0],
                children: undefined,
              };
            return {
              ...obj,
              ...item,
              levelKey: item.type,
            };
          }),
        },
      });
    },
    *fetchExpertAllocationSave({ payload, callback }, { call }) {
      const response = yield call(fetchExpertAllocationSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '哒人等级新增成功',
      });
      callback();
    },
    *fetchExpertAllocationEdit({ payload, callback }, { call }) {
      const response = yield call(fetchExpertAllocationEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '哒人等级修改成功',
      });
      callback();
    },
  },
};
