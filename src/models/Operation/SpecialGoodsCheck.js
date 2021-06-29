import { notification } from 'antd';
import moment from 'moment';
import {
  fetchSpecialGoodsCheckList,
  fetchSpecialGoodsAuditDetail,
  fetchSpecialGoodsAudit,
  fetchSpecialGoodsAuditReject,
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
      const { specialGoodsInfo = {} } = content;
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
        ...newDetail,
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
        description: '审核驳回成功',
      });
      callback();
    },
  },
};
