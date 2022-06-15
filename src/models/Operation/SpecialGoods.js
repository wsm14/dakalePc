import { notification } from 'antd';
import moment from 'moment';
import {
  fetchSpecialGoodsList,
  fetchSpecialGoodsSave,
  fetchSpecialGoodsEdit,
  fetchSpecialGoodsShareEdit,
  fetchSpecialGoodsDetail,
  fetchSpecialGoodsShareDetail,
  fetchSpecialGoodsStatus,
  fetchSpecialGoodsDelete,
  fetchSpecialGoodsImport,
  fetchSpecialGoodsQrCode,
  fetchCheckMreRate, // 查询店铺主体费率
  fetchSpecialGoodsRecommend, //推荐
  fetchSpecialGoodsAddRemain, // 增加库存
  fetchEditCurrentStatus, //编辑前校验
  fetchSetTopRecommendWeight, //资源位权重
} from '@/services/OperationServices';

export default {
  namespace: 'specialGoods',

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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchSpecialGoodsList, {
        // activityType: 'specialGoods', // 限制特惠商品搜索到电商商品
        ...payload,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.offlineManagerResps,
            total: content.total,
          },
        },
      });
    },
    *fetchSpecialGoodsDetail({ payload, callback }, { call }) {
      const { type, ...other } = payload;
      const response = yield call(fetchSpecialGoodsDetail, { ...other });
      if (!response) return;
      const { ownerId, goodsId } = payload;
      const { content } = response;
      const {
        offlineDetail = {},
        //  divisionFlag
      } = content;
      const {
        needOrder,
        availableAreas, //城市
        activityStartDate,
        activityEndDate,
        useTimeRuleObject = {}, //销售时间
        buyDesc = '[]',
        activityTimeRule: activeTime,
        settleInfoResp = {}, //结算人
        skuInfoResp = {}, //价格
        platformTagIds,
        // displayFilterTags,
        relationOwnerInfoResps = [], //集团关联店铺
        thirdInfoResp, //商品类别
        divisionParamInfoResp = {}, //分佣设置
        // relateIdString: relateId,
      } = offlineDetail;
      const { settlerId, settlerType, settlerName } = settleInfoResp;
      const {
        startDate,
        endDate,
        type: useTimeRule,
        useDay = '00:00-23:59',
        useWeek = '1,2,3,4,5,6,7',
      } = useTimeRuleObject;
      let newDetail = {};

      // 可编辑 info 查看 /  edit 修改所有数据 / again 重新发布 / againUp
      if (['info', 'edit', 'again', 'againUp'].includes(type)) {
        newDetail = {
          activityStartDate:
            activeTime === 'infinite' ? [] : [moment(activityStartDate), moment(activityEndDate)],
          startDate: useTimeRule === 'fixed' ? [moment(startDate), moment(endDate)] : [],
          timeSplit: useWeek === '1,2,3,4,5,6,7' ? useWeek : 'part',
          timeType: useDay === '00:00-23:59' ? useDay : 'part',
          useDay:
            useDay === '00:00-23:59' ? [] : useDay.split('-').map((item) => moment(item, 'HH:mm')),
          useWeek: useWeek === '1,2,3,4,5,6,7' ? [] : useWeek.split(','),
        };
      }
      //重新发布的时候如果活动开始时间小于当天，活动时间清空
      let activeTimes = {};
      if (type === 'again' && activeTime === 'fixed') {
        let d = new Date();
        const today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        if (today > activityStartDate) {
          activeTimes = {
            activityStartDate: [],
          };
        }
      }

      let cityList = [];
      if (availableAreas !== 'all') {
        cityList = availableAreas.split(',').map((item) => {
          return { city: [item.slice(0, 2), item.slice(0, 4)] };
        });
      }

      //改变集团店铺数据的id和name
      let relationOwnerInfoRespsList = [];
      if (relationOwnerInfoResps.length) {
        relationOwnerInfoRespsList = relationOwnerInfoResps.map((item) => {
          item.merchantId = item.ownerId;
          item.merchantName = item.name;
          return item;
        });
      }

      callback({
        ...content.offlineDetail,
        ...newDetail,
        ...activeTimes,
        // relateId,
        settlerId,
        settlerType,
        settlerName,
        ownerId,
        id: goodsId,
        skuInfoReq: skuInfoResp,
        availableAreas: availableAreas === 'all' ? availableAreas : 'city',
        cityList,
        // divisionFlag,
        buyDesc: buyDesc.includes(']') ? JSON.parse(buyDesc || '[]') : [],
        // allowRefund: Number(allowRefund),
        // allowExpireRefund: Number(allowExpireRefund),
        needOrder: Number(needOrder),
        platformTagIds: platformTagIds ? platformTagIds.split(',') : [],
        // displayFilterTags: displayFilterTags.split(','),
        relationOwnerInfoResps: relationOwnerInfoRespsList,
        thirdInfoReq: thirdInfoResp,
        divisionParamInfoReq: divisionParamInfoResp,
      });
    },
    *fetchSpecialGoodsShareDetail({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsShareDetail, payload);
      if (!response) return;
      const { content } = response;
      const { shareInfo = {} } = content;
      callback(shareInfo);
    },
    *fetchSpecialGoodsSave({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsSave, payload);
      if (!response) return;

      callback();
    },
    *fetchPlatformEquityGoodsSave({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '权益商品新增成功',
      });
      callback();
    },
    *fetchPlatformEquityGoodsEdit({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '权益商品修改成功',
      });
      callback();
    },
    *fetchSpecialGoodsShareEdit({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsShareEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动分享图设置成功',
      });
      callback();
    },
    *fetchSpecialGoodsShareEditCommerceGoods({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsShareEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '电商品分享图设置成功',
      });
      callback();
    },
    *fetchSpecialGoodsEdit({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialGoodsEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动修改成功',
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
    *fetchSpecialGoodsDelete({ payload, callback }, { call, put }) {
      const response = yield call(fetchSpecialGoodsDelete, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动删除成功',
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
        description: '库存修改成功',
      });
      callback();
    },
    *fetchCheckMreRate({ payload, callback }, { call }) {
      const response = yield call(fetchCheckMreRate, payload);
      if (!response) return;
      callback(response.content);
    },
    //  * 特惠或券编辑前校验
    *fetchEditCurrentStatus({ payload, callback }, { call }) {
      const response = yield call(fetchEditCurrentStatus, payload);
      if (!response) return;
      callback && callback(response.resultCode);
    },
    *fetchSetTopRecommendWeight({ payload, callback }, { call }) {
      const response = yield call(fetchSetTopRecommendWeight, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '权重设置成功',
      });
      callback();
    },
  },
};
