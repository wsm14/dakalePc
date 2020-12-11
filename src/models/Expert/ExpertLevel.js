import { notification } from 'antd';
import { fetchExpertLevelList, fetchExpertSortSet } from '@/services/ExpertServices';

export default {
  namespace: 'expertLevel',

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
      const response = yield call(fetchExpertLevelList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.levelConfigList.map((item) => {
            const pictures = JSON.parse(item.pictures);
            const rights = JSON.parse(item.rights);
            const target = item.target ? JSON.parse(item.target) : {};
            return {
              ...item,
              activity: pictures.activity,
              currentLevel: pictures.currentLevel,
              rights,
              target: Object.keys(target).map((item) => ({
                title: item,
                value: target[item],
              })),
            };
          }),
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
