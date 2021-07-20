import { notification } from 'antd';
import moment from 'moment';
import {
  fetchSpecialGoodsCheckList,
  fetchSpecialGoodsAuditDetail,
  fetchSpecialGoodsAudit,
  fetchSpecialGoodsAuditReject,
  fetchSpecialGoodsAuditClose,
} from '@/services/OperationServices';

export default {
  namespace: 'specialGoodsCheck',

  state: {
    list: [],
    total: 0,
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
      const response = yield call(fetchSpecialGoodsCheckList, payload);
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
    *fetchSpecialGoodsAuditDetail({ payload, callback }, { call }) {
      const { type, ...other } = payload;
      const response = yield call(fetchSpecialGoodsAuditDetail, { ...other });
      if (!response) return;
      const { content } = response;
      const { auditId, ownerId } = payload;
      // divisionFlag 是否能手动设置佣金 0-否 1-是
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
        serviceDivisionDTO = {},
      } = specialGoodsInfo;
      let newDetail = {};
      const { provinceBean = '', districtBean = '', darenBean = '' } = serviceDivisionDTO;
      const pBean =
        provinceBean || provinceBean == '0' ? (Number(provinceBean) / 100).toFixed(2) : '';
      const dBean =
        districtBean || districtBean == '0' ? (Number(districtBean) / 100).toFixed(2) : '';
      const daBean = darenBean || darenBean == '0' ? (Number(darenBean) / 100).toFixed(2) : '';
      const sDetail = {
        serviceDivisionDTO: {
          provinceBean: pBean,
          districtBean: dBean,
          darenBean: daBean,
        },
      };
      // 可编辑 info 查看 /  edit 修改所有数据 / again 重新发布
      if (['edit', 'again'].includes(type)) {
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
        ...content.auditDetail,
        rejectObj: {
          rejectReason: content.auditDetail.rejectReason,
          rejectImg: content.auditDetail.rejectImg,
        },
        ...content.specialGoodsInfo,
        ...newDetail,
        ...sDetail, //分佣
        divisionFlag,
        auditId,
        ownerId,
        buyDesc: buyDesc.includes(']') ? JSON.parse(buyDesc || '[]') : [],
        allowRefund: Number(allowRefund),
        allowExpireRefund: Number(allowExpireRefund),
        needOrder: Number(needOrder),
      });
    },
    *fetchSpecialGoodsAudit({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsAudit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '审核完成',
      });
      callback();
    },
    *fetchSpecialGoodsAuditReject({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsAuditReject, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '审核完成',
      });
      callback();
    },
    *fetchSpecialGoodsAuditClose({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsAuditClose, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '关闭成功',
      });
      callback();
    },
  },
};
