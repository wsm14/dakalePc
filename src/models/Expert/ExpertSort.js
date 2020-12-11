import { notification } from 'antd';
import { fetchExpertSortList, fetchExpertSortSet } from '@/services/ExpertServices';

export default {
  namespace: 'expertSort',

  state: {
    list: [],
    total: 0,
    userLevelSortConfig: {},
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
      const response = yield call(fetchExpertSortList, payload);
      if (!response) return;
      const { content } = response;
      const sortObj = JSON.parse(content.userLevelSortConfig.extraParam);
      yield put({
        type: 'save',
        payload: {
          userLevelSortConfig: sortObj,
          list: Object.keys(sortObj).map((item, i) => ({
            index: i,
            keyName: item,
            key: item,
            value: sortObj[item],
          })),
        },
      });
    },
    *fetchExpertSortSet({ payload, callback }, { call, put, select }) {
      const data = yield select((status) => status.expertSort.userLevelSortConfig);
      data[payload.key] = payload.value;
      const response = yield call(fetchExpertSortSet, { extraParam: JSON.stringify(data) });
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '排序机制设置成功',
      });
      callback();
    },
  },
};
