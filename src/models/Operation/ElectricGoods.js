import { notification } from 'antd';
import moment from 'moment';
import {
  fetchListOnlineGoodsByPage,
  fetchSaveOnlineGoods,
  fetchGetGoodsForUpdate,
  fetchUpdateOnlineGoods,
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

      const { skuInfoReqs = [] } = onlineAllResp;
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

      const data = {
        ...onlineAllResp,
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
  },
};

// const content = {
//   brandId: '1532172695714553858',
//   categoryId: '1530017063281807362',
//   categoryNode: '1530016783362347010.1530017063281807362',
//   displayFilterTags: '1531527708716240897,1531527746326564865',
//   displayType: 'manualOrList',
//   divisionParamInfoReq: { provinceBean: 66, darenBean: 65 },
//   goodsCode: 'shangpinbianma',
//   goodsDescImg:
//     'https://resource-new.dakale.net/dev/image/54650b71-05c1-4417-0424-00c722b6b5a6.png,https://resource-new.dakale.net/dev/image/c11012b6-741c-4b15-0a40-0a57c7751271.png',
//   goodsName: '商品名称',
//   ownerId: -1,
//   ownerType: 'admin',
//   paymentModeType: 'self',
//   platformTagIds: '1409444390286528514,1410926567233646593',
//   postageRuleObject: { type: 'manual', fee: 1 },
//   relateId: '1531517490425696258',
//   relateType: 'supplier',
//   returnRuleObject: { returnFlag: 1 },
//   richText: '<p>富文本</p>',
//   sellType: 'single',
//   settleObject: { settlerType: 'settle', settlerId: '1531554662029664258' },
//   shippingRuleObject: { shippingAddress: '杭州市', shippingTime: '24小时内发货' },
//   skuInfoReqs: [
//     {
//       attributes: [
//         { name: '尺寸', value: 's' },
//         { name: '颜色', value: '红' },
//       ],
//       image:
//         'https://resource-new.dakale.net/dev/image/221268a9-8855-4161-6b16-981338190503.png',
//       initStock: 200,
//       oriPrice: 50,
//       sellBean: 100,
//       sellPrice: 90,
//       settlePrice: 60,
//       skuCode: 'sku1',
//     },
//     {
//       attributes: [
//         { name: '尺寸', value: 's' },
//         { name: '颜色', value: '黄' },
//       ],
//       image:
//         'https://resource-new.dakale.net/dev/image/16185523-5478-46a1-6217-321a86852a81.png',
//       initStock: 199,
//       oriPrice: 49,
//       sellBean: 100,
//       sellPrice: 89,
//       settlePrice: 59,
//       skuCode: 'sku2',
//     },
//     {
//       attributes: [
//         { name: '尺寸', value: 'm' },
//         { name: '颜色', value: '红' },
//       ],
//       image:
//         'https://resource-new.dakale.net/dev/image/16185523-5478-46a1-6217-321a86852a81.png',
//       initStock: 198,
//       oriPrice: 48,
//       sellBean: 100,
//       sellPrice: 88,
//       settlePrice: 58,
//       skuCode: 'sku3',
//     },
//     {
//       attributes: [
//         { name: '尺寸', value: 'm' },
//         { name: '颜色', value: '黄' },
//       ],
//       image:
//         'https://resource-new.dakale.net/dev/image/16185523-5478-46a1-6217-321a86852a81.png',
//       initStock: 197,
//       oriPrice: 47,
//       sellBean: 100,
//       sellPrice: 87,
//       settlePrice: 57,
//       skuCode: 'sku4',
//     },
//   ],
//   stockUnit: '件',
// };
