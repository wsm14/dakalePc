import { notification } from 'antd';
import {
  fetchPlatformCouponSave,
  fetchPagePlatformCoupon,
  fetchGetPlatformCouponDetail,
  fetchPlatformCouponOff,
  fetchPlatformCouponOn,
  fetchPlatformCouponUpdate,
  fetchAddTotalPlatformCoupon,
  fetchListRuleByPage,
  fetchGivePlatformCoupon,
  fetchPagePlatformCouponGiveImport,
  fetchPagePlatformCouponGiveImportDetail,
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
    ruleByPagelist: { list: [], total: 0 },
    importList: {
      list: [],
      total: 0,
    },
    importDetailList: {
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
        increaseRuleObject = {},
        ...other
      } = platformCouponDetail;

      const data = {
        ...other,
        ...getRuleObject,
        ...increaseRuleObject,
        activeDate: [moment(activeDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        increaseRule: Object.keys(increaseRuleObject).length === 0 ? '0' : '1',
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
    //  get 券规则管理 - 列表
    *fetchListRuleByPage({ payload }, { call, put }) {
      const response = yield call(fetchListRuleByPage, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          ruleByPagelist: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    //  post 券规则管理 - 赠送
    *fetchGivePlatformCoupon({ payload, callback }, { call, put }) {
      const response = yield call(fetchGivePlatformCoupon, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '成功',
      });
      callback && callback();
    },
    *fetchGiveImportGetList({ payload }, { call, put }) {
      const response = yield call(fetchPagePlatformCouponGiveImport, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          importList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchGiveImportGetListDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchPagePlatformCouponGiveImportDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          importDetailList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
  },
};
