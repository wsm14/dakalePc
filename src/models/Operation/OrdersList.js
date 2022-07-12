import { notification } from 'antd';
import {
  fetchOrdersList,
  fetchOrdersImport,
  fetchOrdersDetail,
  fetchOrderRefundOwn,
  fetchOrderDeliverGoods,
  fetchOrdersListActionLog,
  fetchBatchSplitAccount,
  fetchPageListOrdersList,
  fetchGetOrderDetail,
  fetchDeliverGoods,
  fetchOrderImmediateRefund,
  fetchSubLedger,
  fetchExportUndeliveredCommerceGoodsOrderList,
  fetchGetUserAfterSalesFee,
} from '@/services/OperationServices';

export default {
  namespace: 'ordersList',

  state: {
    list: [],
    total: 0,
    orderDetail: {},
    newList: { list: [], total: 0 },
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
      const response = yield call(fetchOrdersList, payload);
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
    *fetchOrdersImport({ payload, callback }, { call }) {
      const response = yield call(fetchOrdersImport, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.orderDTOS);
    },
    *fetchOrderRefundOwn({ payload, callback }, { call }) {
      const response = yield call(fetchOrderRefundOwn, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '退款提交成功',
      });
      callback();
    },
    *fetchOrderDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchOrdersDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.order);
      yield put({
        type: 'save',
        payload: {
          orderDetail: content.order,
        },
      });
    },
    *fetchOrderDeliverGoods({ payload, callback }, { call }) {
      const response = yield call(fetchOrderDeliverGoods, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '保存成功',
      });
      callback();
    },
    *fetchOrdersListActionLog({ payload, callback }, { call, put }) {
      const response = yield call(fetchOrdersListActionLog, payload);
      if (!response) return;
      const { content = {} } = response;
      const { recordList = [] } = content;
      if (!recordList.length) {
        notification.info({
          message: '温馨提示',
          description: '暂无日志记录',
        });
        return;
      }
      callback(recordList);
    },
    // post 订单列表 - 批量分账
    *fetchBatchSplitAccount({ payload, callback }, { call }) {
      const { type, ...other } = payload;
      const response = yield call(fetchBatchSplitAccount, { ...other });
      if (!response) return;
      if (type === 'one') {
        notification.success({
          message: '温馨提示',
          description: '分账成功',
        });
      } else {
        notification.success({
          message: '温馨提示',
          description: '批量分账成功',
        });
      }
      callback && callback();
    },
    // get 订单列表 - 列表(新)
    *fetchPageListOrdersList({ payload, callback }, { call, put }) {
      const response = yield call(fetchPageListOrdersList, payload);
      if (!response) return;
      const { content } = response;
      const { orderDetailList = [], total } = content;

      const list = orderDetailList.map((item) => {
        const { orderDesc, settleParam, divisionParam, deductFee } = item;

        return {
          ...item,
          orderDesc: JSON.parse(orderDesc || '{}'),
          settleParam: JSON.parse(settleParam || '{}'),
          divisionParam: JSON.parse(divisionParam || '{}'),
          deductFee: JSON.parse(deductFee || '[]'),
        };
      });

      console.log('list: ', list);
      yield put({
        type: 'save',
        payload: {
          newList: {
            list,
            total,
          },
        },
      });
      callback && callback(list);
    },
    // get 订单列表 - 详情（新）
    *fetchGetOrderDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOrderDetail, payload);
      if (!response) return;
      const { content } = response;
      const { orderDetail = {} } = content;
      const data = {
        ...orderDetail,
        orderDesc: JSON.parse(orderDetail.orderDesc || '{}'),
        settleParam: JSON.parse(orderDetail.settleParam || '{}'),
        divisionParam: JSON.parse(orderDetail.divisionParam || '{}'),
        deductFee: JSON.parse(orderDetail.deductFee || '[]'),
      };

      console.log(11, data);
      callback(data);
      yield put({
        type: 'save',
        payload: {
          orderDetail: data,
        },
      });
    },
    // post 电商订单-发货(新)
    *fetchDeliverGoods({ payload, callback }, { call }) {
      const response = yield call(fetchDeliverGoods, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '保存成功',
      });
      callback();
    },
    // post 订单列表 - 手动退款（新）
    *fetchOrderImmediateRefund({ payload, callback }, { call }) {
      const response = yield call(fetchOrderImmediateRefund, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '退款提交成功',
      });
      callback();
    },
    // post 订单列表 - 分账（新）
    *fetchSubLedger({ payload, callback }, { call }) {
      const response = yield call(fetchSubLedger, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分账成功',
      });
      callback && callback();
    },
    // get 订单列表(新) - 导出（暂时）
    *fetchExportUndeliveredCommerceGoodsOrderList({ payload, callback }, { call }) {
      const response = yield call(fetchExportUndeliveredCommerceGoodsOrderList, payload);
      if (!response) return;
      const { content } = response;
      const { orderDetailList = [] } = content;

      const list = orderDetailList.map((item) => {
        const { orderDesc, settleParam, divisionParam, deductFee } = item;

        return {
          ...item,
          orderDesc: JSON.parse(orderDesc || '{}'),
          settleParam: JSON.parse(settleParam || '{}'),
          divisionParam: JSON.parse(divisionParam || '{}'),
          deductFee: JSON.parse(deductFee || '[]'),
        };
      });
      callback && callback(list);
    },
    // get 订单列表(新) - 获取退款详细信息
    *fetchGetUserAfterSalesFee({ payload, callback }, { call }) {
      const response = yield call(fetchGetUserAfterSalesFee, payload);
      if (!response) return;
      const { content } = response;
      const { afterSalesFeeResp = {} } = content;

      callback && callback(afterSalesFeeResp);
    },
  },
};
