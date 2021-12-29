import { notification } from 'antd';
import {
  fetchPlatformCouponSave,
  fetchPagePlatformCoupon,
  fetchGetPlatformCouponDetail,
} from '@/services/OperationServices';
import moment from 'moment';

export default {
  namespace: 'platformCoupon',

  state: {
    list: {
      list: [],
      total: 0,
    },
    getRecordList: {
      list: [],
      total: 0,
    },
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
      const response = yield call(fetchPagePlatformCoupon, payload);
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
    },
    // post 平台券 - 创建平台券 - 新增
    *fetchPlatformCouponSave({ payload, callback }, { call }) {
      const response = yield call(fetchPlatformCouponSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '平台券新增成功',
      });
      callback && callback();
    },
    // get 平台券 - 详情
    *fetchGetPlatformCouponDetail({ payload, callback }, { call }) {
      const response = yield call(fetchGetPlatformCouponDetail, payload);
      if (!response) return;
      const { content } = response;
      const { platformCouponDetail } = content;
      const {
        activeDate,
        endDate,
        getRuleObject = {},
        ruleConditionObjects = [],
      } = platformCouponDetail;
      const data = {
        ...getRuleObject,
        activeDate: [moment(activeDate, 'YYYY-DD-MM'), moment(endDate, 'YYYY-DD-MM')],
        ruleCondition:
          ruleConditionObjects[0].ruleConditionList[0].condition === 'all'
            ? '0'
            : ruleConditionObjects[0].ruleType === 'availableAreaRule'
            ? '1'
            : '2',
        // citys:
      };

      callback && callback();
    },
  },
};
