import { notification } from 'antd';
import {
  fetchListRedEnvelopesManagement,
  fetchListRedEnvelopesReceives,
  fetchGetRedEnvelopeDetail,
  fetchSetLuckyRedEnvelopeAuthority,
  fetchSetNormalRedEnvelopeAuthority,
  fetchWhiteNameList,
  fetchWhiteNameListDelete,
  fetchWhiteNameListAdd,
} from '@/services/RedEnvelopesServices';

export default {
  namespace: 'redEnvelopes',
  state: {
    list: [],
    total: 0,
    recordObj: {},
    recordList: { list: [], total: 0 },
    whiteNameList: { list: [], total: 0, keys: [] },
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
    *fetchListRedEnvelopesManagement({ payload }, { call, put }) {
      const response = yield call(fetchListRedEnvelopesManagement, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchListRedEnvelopesReceives({ payload, callback }, { call, put }) {
      const response = yield call(fetchListRedEnvelopesReceives, payload);
      if (!response) return;
      const { content } = response;
      const { userRedEnvelopesReceiveList = [] } = content.userRedEnvelopesDTO;
      yield put({
        type: 'save',
        payload: {
          recordObj: content.userRedEnvelopesDTO,
          recordList: {
            list: userRedEnvelopesReceiveList,
            total: userRedEnvelopesReceiveList?.length,
          },
        },
      });
      callback && callback(content.userRedEnvelopesDTO);
    },
    *fetchGetRedEnvelopeDetail({ payload, callback }, { call }) {
      const response = yield call(fetchGetRedEnvelopeDetail, {
        parent: 'redEnvelope',
        child: 'lucky',
      });
      const responseNormal = yield call(fetchGetRedEnvelopeDetail, {
        parent: 'redEnvelope',
        child: 'normal',
      });
      if (!response || !responseNormal) return;
      const { dictionary } = response.content;
      const { dictionary: dictionaryNormal } = responseNormal.content;
      const extraParam = dictionary.extraParam;
      const extraParamNormal = dictionaryNormal.extraParam;
      const params = extraParam ? JSON.parse(extraParam || '{}') : {};
      const paramsNormal = extraParamNormal ? JSON.parse(extraParamNormal || '{}') : {};
      console.log(params, paramsNormal, '2212');
      callback &&
        callback({
          extraParam: {
            ...dictionary,
            ...params,
          },
          extraParamNormal: { ...dictionaryNormal, ...paramsNormal },
        });
    },

    *fetchSetLuckyRedEnvelopeAuthority({ payload, callback }, { call }) {
      const { dictionaryId, extraParam, extraParamNormal } = payload;
      const response = yield call(fetchSetLuckyRedEnvelopeAuthority, {
        dictionaryId,
        extraParam,
      });
      const responseNormal = yield call(fetchSetNormalRedEnvelopeAuthority, {
        dictionaryId,
        extraParam: extraParamNormal,
      });
      if (!response || !responseNormal) return;
      notification.success({
        message: '温馨提示',
        description: '设置成功',
      });
      callback();
    },
    *fetchWhiteNameList({ payload, callback }, { call, put }) {
      const response = yield call(fetchWhiteNameList, payload);
      if (!response) return;
      const { content } = response;
      const { recordList: list = [], total } = content;
      const keys = list.map((item) => item.userIdString);
      yield put({
        type: 'save',
        payload: {
          whiteNameList: { list, total: total, keys },
        },
      });
    },
    // 普通红包-白名单-删除
    *fetchWhiteNameListDelete({ payload, callback }, { call }) {
      const response = yield call(fetchWhiteNameListDelete, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `设置成功`,
      });
      callback();
    },
    // 普通红包-白名单-设置
    *fetchWhiteNameListAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWhiteNameListAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `设置成功`,
      });
      callback();
    },
  },
};
