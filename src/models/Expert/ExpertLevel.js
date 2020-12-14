import { notification } from 'antd';
import { rightsJson } from '@/common/expertLevelJSON';
import { fetchExpertLevelList, fetchExpertLevelSet } from '@/services/ExpertServices';

export default {
  namespace: 'expertLevel',

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
      const response = yield call(fetchExpertLevelList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.levelConfigList.map((item) => {
            const pictures = JSON.parse(item.pictures);
            const rights = item.rights ? JSON.parse(item.rights) : [];
            const target = item.target ? JSON.parse(item.target) : {};
            return {
              ...item,
              activity: pictures.activity,
              currentLevel: pictures.currentLevel,
              rights: rights
                .map((item) => {
                  const checkArr = rightsJson.filter((i) => i.title == item.title);
                  if (checkArr.length) {
                    return { ...checkArr[0], ...item };
                  }
                  return false;
                })
                .filter((i) => i),
              target: Object.keys(target).map((item) => ({
                title: item,
                value: target[item],
              })),
            };
          }),
        },
      });
    },
    *fetchExpertLevelSet({ payload, callback }, { call }) {
      const { target, rights } = payload;
      const targetArr = target.map((i) => ({ [i.title]: i.value }));
      const response = yield call(fetchExpertLevelSet, {
        ...payload,
        target: JSON.stringify(targetArr.length ? Object.assign(...targetArr) : {}),
        rights: JSON.stringify(rights),
      });
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '权益等级设置保存成功',
      });
      callback && callback();
    },
  },
};
