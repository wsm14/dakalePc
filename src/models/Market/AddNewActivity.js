import { notification } from 'antd';
import {
  fetchMarketAddNewActivity,
  fetchMarketAddNewActivityDetail,
  fetchMarketAddNewActivityCancel,
  fetchMarketAddNewActivityAdd,
  fetchMarketAddNewActivityEdit,
  fetchAddNewActivityDetailCheck,
} from '@/services/MarketServices';
import { fetchSpecialGoodsDetail } from '@/services/OperationServices';

export default {
  namespace: 'addNewActivity',

  state: {
    list: [],
    // radioType: { user: {}, merchant: {}, weChat: {} },
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
    // 裂变拉新活动编辑
    *fetchMarketAddNewActivityEdit({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `活动编辑修改成功`,
      });
      callback();
    },
    // 裂变拉新活动新增
    *fetchMarketAddNewActivityAdd({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `活动新增成功`,
      });
      callback();
    },
    // 裂变拉新活动下架
    *fetchMarketAddNewActivityCancel({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityCancel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `下架修改成功`,
      });
      callback();
    },
    // 获取裂变模板-列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMarketAddNewActivity, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.configFissionTemplateDTOS,
        },
      });
    },
    // 裂变拉新活动详情
    *fetchMarketAddNewActivityDetail({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityDetail, payload);
      if (!response) return;
      const { content } = response;
      const { prizeRightGoodsIds, rightGoodsIds, specialGoodsIds } =
        content.configFissionTemplateDTO;
      let prizeRightGoodsDetail = {};
      if (prizeRightGoodsIds) {
        prizeRightGoodsDetail = yield call(fetchSpecialGoodsDetail, {
          specialGoodsId: prizeRightGoodsIds,
          ownerId: -1,
        });
      }
      const rightGoodsDetail = yield call(fetchAddNewActivityDetailCheck, {
        activityIds: rightGoodsIds,
      });
      const specialGoodsDetail = yield call(fetchAddNewActivityDetailCheck, {
        activityIds: specialGoodsIds,
      });
      // console.log('1', prizeRightGoodsDetail?.content?.specialGoodsInfo);
      // console.log('2', rightGoodsDetail.content.activityGoodsDTOS);
      // console.log('3', specialGoodsDetail.content.activityGoodsDTOS);
      callback({
        ...content.configFissionTemplateDTO,
        goodsRightInfo: prizeRightGoodsDetail?.content?.specialGoodsInfo || {},
        specialGoods: specialGoodsDetail?.content?.activityGoodsDTOS || [],
        rightGoods: rightGoodsDetail?.content?.activityGoodsDTOS || [],
      });
    },
  },
};
