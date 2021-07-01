import { notification } from 'antd';
import moment from 'moment';
import {
  fetchSpecialGoodsList,
  fetchSpecialGoodsSave,
  fetchSpecialGoodsEdit,
  fetchSpecialGoodsVerify,
  fetchSpecialGoodsDel,
  fetchSpecialGoodsDetail,
  fetchSpecialGoodsStatus,
  fetchSpecialGoodsRecommend,
  fetchSpecialGoodsImport,
  fetchSpecialGoodsQrCode,
  fetchSpecialCancleRecommend,
  fetchGoodsTagListByCategoryId,
  fetchGoodsIsCommission,
  fetchSkuAvailableMerchant,
  fetchSkuDetailMerchantList
} from '@/services/OperationServices';

export default {
  namespace: 'specialGoods',

  state: {
    list: [],
    total: 0,
    skuMerchantList:{list:[],total:0}
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
      const response = yield call(fetchSpecialGoodsList, payload);
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
    *fetchSpecialGoodsDetail({ payload, callback }, { call }) {
      const { type, ...other } = payload;
      const response = yield call(fetchSpecialGoodsDetail, { ...other });
      if (!response) return;
      const { merchantIdStr: merchantId } = payload;
      const { content } = response;
      const { specialGoodsInfo = {}, divisionFlag } = content;
      const {
        allowRefund,
        allowExpireRefund,
        needOrder,
        activityStartTime,
        activityEndTime,
        useStartTime,
        useEndTime,
        buyDesc = '[]',
        useTimeRule,
        activityTimeRule: activeTime,
        useTime = '00:00-23:59',
        useWeek = '1,2,3,4,5,6,7',
      } = specialGoodsInfo;
      let newDetail = {};
      // 可编辑 info 查看 /  edit 修改所有数据 / again 重新发布
      if (['info', 'edit', 'again'].includes(type)) {
        newDetail = {
          activityStartTime:
            activeTime === 'infinite' ? [] : [moment(activityStartTime), moment(activityEndTime)],
          useStartTime: useTimeRule === 'fixed' ? [moment(useStartTime), moment(useEndTime)] : [],
          timeSplit: useWeek === '1,2,3,4,5,6,7' ? useWeek : 'part',
          timeType: useTime === '00:00-23:59' ? useTime : 'part',
          useTime:
            useTime === '00:00-23:59'
              ? []
              : useTime.split('-').map((item) => moment(item, 'HH:mm')),
          useWeek: useWeek === '1,2,3,4,5,6,7' ? [] : useWeek.split(','),
        };
      }
      callback({
        ...content.specialGoodsInfo,
        ...specialGoodsInfo.serviceDivisionDTO, //分佣
        ...newDetail,
        merchantId,
        divisionFlag,
        buyDesc: buyDesc.includes(']') ? JSON.parse(buyDesc || '[]') : [],
        allowRefund: Number(allowRefund),
        allowExpireRefund: Number(allowExpireRefund),
        needOrder: Number(needOrder),
      });
    },
    *fetchSpecialGoodsSave({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动新增成功，等待平台审核',
      });
      callback();
    },
    *fetchSpecialGoodsDel({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动删除成功',
      });
      callback();
    },
    *fetchSpecialGoodsVerify({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsVerify, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动审核完成',
      });
      callback();
    },
    *fetchSpecialGoodsEdit({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动修改成功，等待平台审核',
      });
      callback();
    },
    *fetchSpecialGoodsStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchSpecialGoodsStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动下架成功',
      });
      callback();
    },
    *fetchSpecialGoodsQrCode({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsQrCode, payload);
      if (!response) return;
      const { content } = response;
      callback(content.qcodeUrl);
    },
    *fetchSpecialGoodsRecommend({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsRecommend, payload);
      if (!response) return;
      const { operationFlag } = payload;
      let mes = '设置推荐成功';
      if (operationFlag === 'cancelRecommend') mes = '取消推荐成功';
      if (operationFlag === 'top') mes = '置顶成功';
      if (operationFlag === 'cancelTop') mes = '取消置顶成功';
      notification.success({
        message: '温馨提示',
        description: mes,
      });
      callback();
    },
    *fetchSpecialGoodsImport({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsImport, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.specialGoodsList);
    },
    //特惠资源位取消推荐
    *fetchSpecialCancleRecommend({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialCancleRecommend, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '取消推荐成功',
      });
      callback();
    },
    *fetchGoodsTagListByCategoryId({ payload, callback }, { call }) {
      const response = yield call(fetchGoodsTagListByCategoryId, payload);
      if (!response) return;
      const { content } = response;
      callback(content.configGoodsTagList);
    },
    *fetchGoodsIsCommission({ payload, callback }, { call }) {
      const response = yield call(fetchGoodsIsCommission, payload);
      if (!response) return;
      const { content } = response;
      callback(content.manuallyFlag);
    },
    *fetchSkuAvailableMerchant({ payload, callback }, { call, put }) {
      const response = yield call(fetchSkuAvailableMerchant, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          skuMerchantList:content.merchantList
        },
      });
    },
    // sku通用-sku挂靠商家列表
    *fetchSkuDetailMerchantList({ payload, callback }, { call, put }){
      const response = yield call(fetchSkuDetailMerchantList, payload);
      if (!response) return;
      const { content } = response;
      callback(content.merchantList);
    }
  },
};
