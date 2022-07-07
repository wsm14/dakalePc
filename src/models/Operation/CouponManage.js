import moment from 'moment';
import { notification } from 'antd';
import {
  fetchCouponList,
  fetchCouponSave, //新增
  fetchCouponDetail,
  fetchCouponToImport,
  fetchCouponUpdate, //券编辑
  fetchCouponOff, // 券下架
  fetchCouponDelete, //全删除
  fetchCouponAddRemain,
  fetchCouponManageShareEdit, // 分享配置
  fetchListFreeReduceCouponReceiveVerificationRecord, // 领取核销记录
} from '@/services/OperationServices';

export default {
  namespace: 'couponManage',

  state: {
    list: [],
    total: 0,
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
    // 修改分享配置
    *fetchCouponManageShareEdit({ payload, callback }, { call }) {
      const response = yield call(fetchCouponManageShareEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券分享图设置成功',
      });
      callback();
    },
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchCouponList, payload);
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
    *fetchCouponDetail({ payload, callback }, { call }) {
      const { type, ...other } = payload;
      const response = yield call(fetchCouponDetail, { ...other });
      if (!response) return;
      const { content } = response;
      const {
        couponDesc,
        activeDate = '',
        endDate = '',
        useTimeRule = '',
        ownerIdString = '',
        useTime = '',
        useWeek = '',
      } = content.ownerCouponInfo;

      const timeTypeCheck = useTime === '00:00-23:59' ? useTime : 'part';
      const useWeekCheck = useWeek === '1,2,3,4,5,6,7' ? useWeek : 'part';
      const times = useTime.split('-');

      let newDetail = {};
      if (['edit', 'again'].includes(type)) {
        newDetail = {
          activeDate:
            useTimeRule === 'fixed'
              ? [moment(activeDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
              : [],
          useTime:
            timeTypeCheck === 'part' ? [moment(times[0], 'HH:mm'), moment(times[1], 'HH:mm')] : [],
          timeTypeCheck,
          useWeekCheck,
          useWeek: useWeekCheck === 'part' ? useWeek.split('') : [],
          ownerId: ownerIdString,
        };
      }
      callback({
        ...content.ownerCouponInfo,
        couponDescString: couponDesc?.includes(']')
          ? JSON.parse(couponDesc || '[]').join('\n')
          : couponDesc,
        couponDesc: couponDesc?.includes(']') ? JSON.parse(couponDesc || '[]') : [],
        ...content,
        ...newDetail,
      });
    },
    *fetchCouponSave({ payload, callback }, { call }) {
      const response = yield call(fetchCouponSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券新增成功，等待平台审核',
      });
      callback();
    },
    *fetchPlatformEquityCouponSave({ payload, callback }, { call }) {
      const response = yield call(fetchCouponSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '权益券新增成功',
      });
      callback();
    },
    *fetchCouponToImport({ payload, callback }, { call }) {
      const response = yield call(fetchCouponToImport, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.ownerCouponList);
    },
    *fetchPlatformEquityCouponUpdate({ payload, callback }, { call }) {
      const response = yield call(fetchCouponUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '权益券修改成功',
      });
      callback();
    },
    *fetchCouponUpdate({ payload, callback }, { call }) {
      const response = yield call(fetchCouponUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券修改成功，等待平台审核',
      });
      callback();
    },
    *fetchCouponOff({ payload, callback }, { call }) {
      const response = yield call(fetchCouponOff, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券下架成功',
      });
      callback();
    },
    *fetchCouponDelete({ payload, callback }, { call }) {
      const response = yield call(fetchCouponDelete, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券删除',
      });
      callback();
    },
    *fetchCouponAddRemain({ payload, callback }, { call }) {
      const response = yield call(fetchCouponAddRemain, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '投放总量修改成功',
      });
      callback();
    },
    *fetchListFreeReduceCouponReceiveVerificationRecord({ payload }, { call, put }) {
      const response = yield call(fetchListFreeReduceCouponReceiveVerificationRecord, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          getRecordList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
  },
};
