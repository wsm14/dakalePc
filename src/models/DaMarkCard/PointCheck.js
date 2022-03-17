import { notification } from 'antd';
import { fetchGetListHittingAuditAdmin, fetchGetVerifyAudit } from '@/services/DaMarkCardServices';

export default {
  namespace: 'pointCheck',

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
    //  哒小卡点位审核列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchGetListHittingAuditAdmin, payload);
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
    *fetchGetVerifyAudit({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetVerifyAudit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '审核成功',
      });
      callback && callback();
    },
  },
};
