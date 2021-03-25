import { notification } from 'antd';
import {
  fetchGetHubName,
  fetchGetHubSelect,
  fetchGetTradeSelect,
  fetchSetTradeSelect,
  fetchGetMreTag,
  fetchMerCheckData,
  fetchGetPropertyJSON,
  fetchGetTasteTag,
  fetchGetKolLevel,
} from '@/services/BaseServices';

export default {
  namespace: 'baseData',

  state: {
    hubData: [],
    propertyJSON: {},
    tasteTag: [],
    kolLevel: [],
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
    *fetchGetHubData({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetHubSelect, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          hubData: content.businessHubList,
        },
      });
      if (callback) callback(content.businessHubList);
    },
    *fetchGetPropertyJSON({ payload }, { call, put }) {
      const response = yield call(fetchGetPropertyJSON, payload);
      if (!response) return;
      const { content } = response;
      const responseJson = yield fetch(content.propertyInfo.url).then(
        async (response) => await response.json(),
      );
      yield put({
        type: 'save',
        payload: {
          propertyJSON: responseJson,
        },
      });
    },
    *fetchGetTasteTag({ payload }, { call, put }) {
      const response = yield call(fetchGetTasteTag, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          tasteTag: content.domainList,
        },
      });
    },
    *fetchGetKolLevel({ payload }, { call, put }) {
      const response = yield call(fetchGetKolLevel, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          kolLevel: content.userLevelList.map(({ levelName: name, level: value }) => ({
            name,
            value,
          })),
        },
      });
    },
    *fetchGetMreTag({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetMreTag, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.tagNames);
    },
    *fetchGetTradeSelect({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetTradeSelect, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.categoryIds);
    },
    *fetchGetHubName({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetHubName, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.businessHubList);
    },
    *fetchSetTradeSelect({ payload, callback }, { call, put }) {
      const response = yield call(fetchSetTradeSelect, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '设置成功',
      });
      callback();
    },
    *fetchMerCheckData({ payload, callback }, { call }) {
      const response = yield call(fetchMerCheckData, payload);
      if (!response) return;
      callback(response.content);
    },
  },
};
