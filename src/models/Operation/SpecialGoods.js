import { notification } from 'antd';
import moment from 'moment';
import {
  fetchSpecialGoodsList,
  fetchSpecialGoodsSave,
  fetchSpecialGoodsEdit,
  fetchSpecialGoodsDel,
  fetchSpecialGoodsDetail,
  fetchSpecialGoodsStatus,
  fetchSpecialGoodsImport,
  fetchSpecialGoodsQrCode,
  fetchSpecialGoodsRecommend, //推荐
  fetchSpecialGoodsAddRemain, // 增加库存
  fetchEditCurrentStatus, //编辑前校验
} from '@/services/OperationServices';

export default {
  namespace: 'specialGoods',

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
      const { ownerId, specialGoodsId } = payload;
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
      // 可编辑 info 查看 /  edit 修改所有数据 / again 重新发布 / againUp
      if (['info', 'edit', 'again', 'againUp'].includes(type)) {
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
      //重新发布的时候如果活动开始时间小于当天，活动时间清空
      let activeTimes = {};
      if (type === 'again' && activeTime === 'fixed') {
        let d = new Date();
        const today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        if (today > activityStartTime) {
          activeTimes = {
            activityStartTime: [],
          };
        }
      }
      callback({
        ...content.specialGoodsInfo,
        ...sDetail, //分佣
        ...newDetail,
        ...activeTimes,
        ownerId,
        id: specialGoodsId,
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
      let mes = '设置推荐成功';
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
    *fetchSpecialGoodsAddRemain({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsAddRemain, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '投放总量修改成功',
      });
      callback();
    },
    //  * 特惠或券编辑前校验
    *fetchEditCurrentStatus({ payload, callback }, { call }) {
      const response = yield call(fetchEditCurrentStatus, payload);
      if (!response) return;
      callback && callback(response.resultCode);
    },
  },
};
