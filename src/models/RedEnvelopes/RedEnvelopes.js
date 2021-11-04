import { notification } from 'antd';
import {
  fetchListRedEnvelopesManagement,
  fetchListRedEnvelopesReceives,
  fetchGetRedEnvelopeDetail,
  fetchSetLuckyRedEnvelopeAuthority,
  fetchSetNormalRedEnvelopeAuthority,
} from '@/services/RedEnvelopesServices';

export default {
  namespace: 'redEnvelopes',
  state: {
    list: [],
    total: 0,
    recordObj: {},
    recordList: { list: [], total: 0 },
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
  },
};
