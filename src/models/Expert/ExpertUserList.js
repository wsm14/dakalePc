import { notification } from 'antd';
import {
  fetchExpertUserTotal,
  fetchExpertUserList,
  fetchExpertStop,
  fetchExpertOpen,
  fetchDarenTag,
  fetchDarenTagSet,
  fetchGetBDList,
  fetchGetBDSet,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertUserList',

  state: {
    list: { list: [], total: 0 },
    BDlist: [],
    userTotal: 0,
    darenTag: {},
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
    // 设置哒人标识
    *fetchDarenTagSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchDarenTagSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '哒人标识设置成功',
      });
      callback();
    },
    // 获取哒人标识
    *fetchDarenTag({ payload }, { call, put }) {
      const response = yield call(fetchDarenTag, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          darenTag: content.dictionary,
        },
      });
    },
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchExpertUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchExpertUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchExpertUserTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userTotal: content.kolCount,
        },
      });
    },
    *fetchGetBDList({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetBDList, payload);
      if (!response) return;
      const { content } = response;
      const sellInfo = content.sellInfo;
      callback &&
        callback(
          sellInfo.sellName
            ? [
                {
                  ...sellInfo,
                  sellName: `${sellInfo.sellName} ${sellInfo.departmentName} ${sellInfo.mobile}`,
                },
              ]
            : [],
        );
    },
    *fetchGetBDSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetBDSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: 'BD关联成功',
      });
      callback();
    },
    *fetchExpertStop({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpertStop, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '封停设置成功',
      });
      callback();
    },
    *fetchExpertOpen({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpertOpen, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '解封成功',
      });
      callback();
    },
  },
};
