import { notification } from 'antd';
import {
  fetchListOnlineGoodsByPage,
  fetchSaveOnlineGoods,
  fetchGetGoodsForUpdate,
  fetchUpdateOnlineGoods,
  fetchOffShelfOffline,
  fetchAddStock,
  fetchListSkuStockByServiceId,
  fetchGetOnlineShareInfo,
  fetchUpdateOnlineShareInfo,
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
    // get 电商品 - 列表
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
        platformTagIds = '',
        categoryNode,
        divisionParamInfoResp,
        ...other
      } = onlineAllResp;

      // 处理规格数据
      let attributesList = [];
      const attributesType = skuInfoReqs[0]?.attributes?.map((item) => item.name);
      // 得到新的商品数据数组 - newSkuInfoReqs
      const newSkuInfoReqs = skuInfoReqs.map((item) => {
        const { remain = '' } = item;

        item.attributes.map((it) => {
          attributesList.push(it);
        });
        // 详情、编辑回显时，库存显示剩余库存
        return {
          ...item,
          initStock: remain,
        };
      });
      // 处理得到规格数组
      const newAttributes = attributesType?.map((item) => {
        const arr = attributesList.filter((it) => it.name == item).map((it) => it.value);
        const set = new Set(arr);
        return {
          name: item,
          value: [...set],
        };
      });
      // 处理规格数据 end

      let oneSku = {};
      if (newAttributes.length == 0) {
        oneSku = newSkuInfoReqs[0];
      }

      const data = {
        ...other,
        ...oneSku,
        newSkuInfoReqs,
        settleInfoReq,
        divisionParamInfoReq: divisionParamInfoResp,
        platformTagIds: platformTagIds.split(','),
        categoryNode: categoryNode.split('.'),
        customSize: skuInfoReqs.length > 0 ? newAttributes : [],
      };

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
    // post 电商品 - 修改库存
    *fetchAddStock({ payload, callback }, { call }) {
      const response = yield call(fetchAddStock, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '库存修改成功',
      });
      callback && callback();
    },
    // get 电商品 - sku列表
    *fetchListSkuStockByServiceId({ payload, callback }, { call, put }) {
      const response = yield call(fetchListSkuStockByServiceId, payload);
      if (!response) return;
      const { content } = response;
      const { skuManagerResps = [] } = content;

      // 处理规格数据
      let attributesList = [];
      const attributesType = skuManagerResps[0]?.skuAttributeResps?.map((item) => item.name);
      skuManagerResps.map((item) => {
        item.skuAttributeResps.map((it) => {
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

      const data = {
        skuInfoReqs: skuManagerResps,
        customSize: newAttributes,
      };

      callback && callback(data);
    },
    // get 电商品 - 获取分享配置详情
    *fetchGetOnlineShareInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOnlineShareInfo, payload);
      if (!response) return;
      const { content } = response;
      const { shareInfo = {} } = content;

      callback && callback(shareInfo);
    },
    // post 电商品 - 分享配置修改
    *fetchUpdateOnlineShareInfo({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateOnlineShareInfo, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分享配置修改成功',
      });
      callback && callback();
    },
  },
};
