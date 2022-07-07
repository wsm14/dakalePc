import moment from 'moment';
import { notification } from 'antd';
import {
  fetchMarketActivityAdd,
  fetchMarketActivityEdit,
  fetchMarketActivityDown,
  fetchMarketActivityList,
  fetchMarketActivityDetail,
  fetchMarketActivityGoodsSave,
  fetchMarketActivityCheckGoods,
  fetchMarketActivityOnlineGoods,
  fetchMarketActivityOfflineGoods,
  fetchMarketActivityGoodsEditRemain,
} from '@/services/MarketServices';

export default {
  namespace: 'marketActivity',

  state: {
    list: { list: [], total: 0 },
    onlineGoods: { list: [], total: 0 }, // 电商品
    offlineGoods: { list: [], total: 0 }, // 特惠商品
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
      const response = yield call(fetchMarketActivityList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.marketingActivityDetailList, total: content.total },
        },
      });
    },
    *fetchMarketActivityDetail({ payload, callback }, { call, put }) {
      const { mode, ...other } = payload;
      const response = yield call(fetchMarketActivityDetail, other);
      if (!response) return;
      const { content } = response;
      const { marketingActivityDetail: detail = {} } = content;
      const { startDate, endDate, useRuleObject = {}, activityRuleObject = {} } = detail;
      let obj = {};
      if (mode === 'edit') {
        const { useRuleType } = useRuleObject; // 使用规则
        // 活动规则
        const { categories = [], classifies = [], activityRuleType } = activityRuleObject;
        obj = {
          activeDate: [moment(startDate), moment(endDate)],
          activityRuleObject: {
            ...activityRuleObject,
            activityRuleType: activityRuleType.split(','),
            categories: categories.map((i) => i?.categoryId), // 行业规则
            classifies: classifies.map((i) => i?.classifyNode?.split('.')), // 类目规则
          },
          useRuleObject: { ...useRuleObject, useRuleType: useRuleType.split(',') },
        };
      }
      callback && callback({ ...detail, ...obj });
    },
    *fetchMarketActivityOnlineGoods({ payload }, { call, put }) {
      const response = yield call(fetchMarketActivityOnlineGoods, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          onlineGoods: { list: content.activityOnlineGoods, total: content.total },
        },
      });
    },
    *fetchMarketActivityOfflineGoods({ payload }, { call, put }) {
      const response = yield call(fetchMarketActivityOfflineGoods, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          offlineGoods: { list: content.activityOfflineGoods, total: content.total },
        },
      });
    },
    *fetchMarketActivitySet({ payload, callback }, { call }) {
      const { mode, ...other } = payload;
      const fetchApi = { add: fetchMarketActivityAdd, edit: fetchMarketActivityEdit }[mode];
      const fetchText = { add: '创建', edit: '修改' }[mode];
      const response = yield call(fetchApi, other);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `活动${fetchText}成功`,
      });
      callback();
    },
    *fetchMarketActivityDown({ payload, callback }, { call }) {
      const response = yield call(fetchMarketActivityDown, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动下架成功',
      });
      callback();
    },
    *fetchMarketActivityCheckGoods({ payload, callback }, { call }) {
      const response = yield call(fetchMarketActivityCheckGoods, payload);
      if (!response) return;
      callback();
    },
    *fetchMarketActivityGoodsSave({ payload, callback }, { call }) {
      const response = yield call(fetchMarketActivityGoodsSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '添加成功',
      });
      callback();
    },
    *fetchMarketActivityGoodsEditRemain({ payload, callback }, { call }) {
      const response = yield call(fetchMarketActivityGoodsEditRemain, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '库存修改成功',
      });
      callback && callback();
    },
  },
};
