import { notification } from 'antd';
import {
  fetchPlatformCouponSave,
  fetchPagePlatformCoupon,
  fetchGetPlatformCouponDetail,
  fetchPlatformCouponOff,
  fetchPlatformCouponOn,
  fetchPlatformCouponUpdate,
  fetchAddTotalPlatformCoupon,
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
    // post 平台券 - 编辑平台券 - 编辑
    *fetchPlatformCouponUpdate({ payload, callback }, { call }) {
      const response = yield call(fetchPlatformCouponUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '平台券编辑成功',
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
        consortUserOs,
        ...other
      } = platformCouponDetail;
      const ruleCondition = ruleConditionObjects.find(
        (item) => item.ruleType === 'availableAreaRule' || item.ruleType === 'unavailableAreaRule',
      );
      const data = {
        ...other,
        ...getRuleObject,
        activeDate: [moment(activeDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        // 地区类型
        ruleCondition:
          ruleCondition.ruleConditionList[0].condition === 'all'
            ? '0'
            : ruleCondition.ruleType === 'availableAreaRule'
            ? '1'
            : '2',
        citys: ruleCondition.ruleConditionList.map((item) => item.condition),
        consortUserOs: consortUserOs === 'all' ? 'all' : 'noAll',
        apply: consortUserOs !== 'all' ? consortUserOs.split(',') : undefined,
      };

      callback && callback(data);
    },
    //下架
    *fetchPlatformCouponOff({ payload, callback }, { call }) {
      const response = yield call(fetchPlatformCouponOff, payload);
      if (!response) return;
      const { content } = response;
      const { success, platformGiftPackDTOS = [] } = content;
      if (!success) {
        const arr = platformGiftPackDTOS.map((item) => item.giftName);
        notification.info({
          message: '温馨提示',
          description: `该优惠券已投放至${arr.join(',')}无法下架，如需下架，请先下架礼包。`,
        });
        return;
      }
      notification.success({
        message: '温馨提示',
        description: '平台券下架成功',
      });

      callback && callback();
    },
    //上架
    *fetchPlatformCouponOn({ payload, callback }, { call }) {
      const response = yield call(fetchPlatformCouponOn, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '平台券上架成功',
      });
      callback && callback();
    },
    // 增加库存
    *fetchAddTotalPlatformCoupon({ payload, callback }, { call }) {
      const response = yield call(fetchAddTotalPlatformCoupon, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '增加数量成功',
      });
      callback && callback();
    },
  },
};
