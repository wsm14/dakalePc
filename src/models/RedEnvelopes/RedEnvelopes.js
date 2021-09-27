import { notification } from 'antd';
import {
  fetchListRedEnvelopesManagement,
  fetchListRedEnvelopesReceives,
  fetchgetDictionaryAdmin,
  fetchSetLuckyRedEnvelopeAuthority,
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
    *fetchgetDictionaryAdmin({ payload, callback }, { call }) {
      const response = yield call(fetchgetDictionaryAdmin, payload);
      if (!response) return;
      const { content } = response;
      const { extraParam } = content.dictionary;
      const params = extraParam ? JSON.parse(extraParam) : {};
      const newDetail = {
        ...content.dictionary,
        level: params.level,
        extraParam: params.level,
        levelName: params.levelName,
      };
      callback && callback(newDetail);
    },

    *fetchSetLuckyRedEnvelopeAuthority({ payload, callback }, { call }) {
      const response = yield call(fetchSetLuckyRedEnvelopeAuthority, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '设置成功',
      });
      callback();
    },
  },
};
