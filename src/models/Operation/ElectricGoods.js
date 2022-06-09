import { notification } from 'antd';
import moment from 'moment';
import {
  fetchListOnlineGoodsByPage,
  fetchSaveOnlineGoods,
  fetchGetGoodsForUpdate,
  fetchUpdateOnlineGoods,
  fetchOffShelfOffline,
} from '@/services/OperationServices';

export default {
  namespace: 'electricGoods',

  state: {
    list: { list: [], total: 0 },
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
    // post 电商品 - 列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchListOnlineGoodsByPage, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.onlineManagerResps,
            total: content.total,
          },
        },
      });
    },
    // post 电商品 - 新增
    *fetchSaveOnlineGoods({ payload, callback }, { call }) {
      const response = yield call(fetchSaveOnlineGoods, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新建电商品成功',
      });
      callback && callback();
    },
    // get 电商品 - 详情
    *fetchGetGoodsForUpdate({ payload, callback }, { call }) {
      const response = yield call(fetchGetGoodsForUpdate, payload);
      if (!response) return;
      const { content } = response;
      const { onlineAllResp } = content;

      const {
        skuInfoResps: skuInfoReqs = [],
        settleInfoResp: settleInfoReq = {},
        platformTagIds,
        categoryNode,
        ...other
      } = onlineAllResp;

      // 处理规格数据
      let attributesList = [];
      const attributesType = skuInfoReqs[0]?.attributes?.map((item) => item.name);
      skuInfoReqs.map((item) => {
        item.attributes.map((it) => {
          attributesList.push(it);
        });
      });
      const newAttributes = attributesType?.map((item) => {
        const arr = attributesList.filter((it) => it.name == item).map((it) => it.value);
        const set = new Set(arr);
        return {
          name: item,
          value: [...set],
        };
      });

      let oneSku = {};
      if (newAttributes.length == 0) {
        oneSku = skuInfoReqs[0];
      }

      const data = {
        ...other,
        ...oneSku,
        skuInfoReqs,
        settleInfoReq,
        platformTagIds: platformTagIds.split(','),
        categoryNode: categoryNode.split('.'),
        customSize: skuInfoReqs.length > 0 ? newAttributes : [],
      };
      console.log(data);

      callback && callback(data);
    },
    // post 电商品 - 修改
    *fetchUpdateOnlineGoods({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateOnlineGoods, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
      });
      callback && callback();
    },
    // post 电商品 - 下架
    *fetchOffShelfOffline({ payload, callback }, { call }) {
      const response = yield call(fetchOffShelfOffline, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商品下架成功',
      });
      callback && callback();
    },
  },
};
