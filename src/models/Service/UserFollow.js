import { notification } from 'antd';
import {
  fetchListUserFollowUp,
  fetchGetUserFollowUp,
  fetchGetDictionaryAdmin,
  fetchGetUserDetail,
  fetchUpdateUserFollowUp,
  fetchSaveUserFollowUp,
  fetchSetUserFollowUpTags,
  fetchListUserFollowUpImport,
} from '@/services/ServiceServices';

export default {
  namespace: 'userFollow',

  state: {
    list: {
      list: [],
      total: 0,
    },
    allTags: [],
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
    *fetchGetList({ payload, callback }, { call, put }) {
      const response = yield call(fetchListUserFollowUp, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
      callback &&
        callback({
          list: {
            list: content.recordList,
            total: content.total,
          },
        });
    },
    *fetchGetUserFollowUp({ payload, callback }, { call }) {
      const response = yield call(fetchGetUserFollowUp, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userFollowUp);
    },
    *fetchGetDictionaryAdmin({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetDictionaryAdmin, payload);
      if (!response) return;
      const { content } = response;
      const { dictionary } = content;
      const { extraParam = '' } = dictionary;
      const tagArr = extraParam ? extraParam.split(',') : [];
      yield put({
        type: 'save',
        payload: {
          allTags: tagArr,
        },
      });
      callback && callback(dictionary);
    },
    *fetchGetUserDetail({ payload, callback }, { call }) {
      const response = yield call(fetchGetUserDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userDetail);
    },
    *fetchUpdateUserFollowUp({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateUserFollowUp, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback();
    },
    *fetchSaveUserFollowUp({ payload, callback }, { call }) {
      const response = yield call(fetchSaveUserFollowUp, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    //  post 运营后台-用户跟进-设置跟进标签
    *fetchSetUserFollowUpTags({ payload, callback }, { call }) {
      const response = yield call(fetchSetUserFollowUpTags, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增标签成功',
      });
      callback && callback();
    },
    // get 运营后台-用户跟进 - 导出
    *fetchListUserFollowUpImport({ payload, callback }, { call }) {
      const response = yield call(fetchListUserFollowUpImport, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content.userFollowUpDTOS);
    },
  },
};
