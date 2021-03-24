import { notification } from 'antd';
import {
  fetchExpertAllocationList,
  fetchExpertAllocationSave,
  fetchExpertAllocationEdit,
} from '@/services/ExpertServices';

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
      yield put({
        type: 'save',
        payload: {
          list: content.userLevelList.map((item) => {
            let obj = { children: item.configUserLevelList };
            if (item.type === 'normal')
              obj = {
                ...item.configUserLevelList[0],
                children: undefined,
              };
            return {
              ...item,
              ...obj,
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
