import { notification } from 'antd';
import {
  fetchGetHubName,
  fetchGetHubSelect,
  fetchGetTradeSelect,
  fetchSetTradeSelect,
  fetchGetMreTag,
  fetchGetTasteTag,
  fetchGetKolLevel,
  fetchHandleDetail,
  fetchGetLogDetail,
  fetchMerCheckData,
  fetchGetJumpNative,
  fetchGetPropertyJSON,
  fetchGetSelectUserList,
  fetchGetBuyCouponSelect,
  fetchGetFreeCouponSelect,
  fetchGetPhoneComeLocation,
  fetchGetSpecialGoodsSelect,
  fetchimportExcel,
  fetchimportExcelList,
  fetchGetSubsidyRoleBean,
} from '@/services/PublicServices';

export default {
  namespace: 'baseData',

  state: {
    hubData: [],
    propertyJSON: {},
    tasteTag: [],
    kolLevel: [],
    nativeList: [],
    logDetail: { show: false, data: [] },
    couponList: { list: [], total: 0 },
    buyCoupon: { list: [], total: 0 },
    specialGoods: { list: [], total: 0 },
    excelList: { list: [], total: 0 },
    userList: [],
    ruleBean: 0,
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    closeLog(state) {
      return {
        ...state,
        logDetail: { show: false, data: [] },
      };
    },
  },

  effects: {
    *fetchGetSubsidyRoleBean({ payload }, { call, put }) {
      const response = yield call(fetchGetSubsidyRoleBean, payload);
      if (!response) return;
      const { content } = response;
      const { configBehavior = {} } = content;
      const { subsidyBean = 0 } = configBehavior;
      yield put({
        type: 'save',
        payload: {
          ruleBean: Number(subsidyBean),
        },
      });
    },
    *fetchGetHubData({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetHubSelect, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          hubData: content.businessHubList,
        },
      });
      if (callback) callback(content.businessHubList);
    },
    *fetchGetPropertyJSON({ payload }, { call, put }) {
      const response = yield call(fetchGetPropertyJSON, payload);
      if (!response) return;
      const { content } = response;
      const responseJson = yield fetch(content.propertyInfo.url).then(
        async (response) => await response.json(),
      );
      yield put({
        type: 'save',
        payload: {
          propertyJSON: responseJson,
        },
      });
    },
    *fetchGetTasteTag({ payload }, { call, put }) {
      const response = yield call(fetchGetTasteTag, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          tasteTag: content.domainList,
        },
      });
    },
    *fetchGetJumpNative({ payload }, { call, put }) {
      const response = yield call(fetchGetJumpNative, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          nativeList: content.nativeJump.map(
            ({ nativeJumpName: name, nativeJumpType: value, paramList: paramKey }) => ({
              name,
              value,
              paramKey,
            }),
          ),
        },
      });
    },
    *fetchGetKolLevel({ payload }, { call, put }) {
      const response = yield call(fetchGetKolLevel, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          kolLevel: content.userLevelList.map(({ levelName: name, level: value }) => ({
            name,
            value,
          })),
        },
      });
    },
    *fetchHandleDetail({ payload, callback }, { call }) {
      const response = yield call(fetchHandleDetail, payload);
      if (!response) return;
      const { content } = response;
      if (!content.logRecordList.length) {
        notification.info({
          message: '温馨提示',
          description: '暂无日志记录',
        });
        return;
      }
      callback(content.logRecordList);
    },
    *fetchGetLogDetail({ payload }, { call, put }) {
      const response = yield call(fetchGetLogDetail, { ...payload, page: 1, limit: 999 });
      if (!response) return;
      const { content } = response;
      if (!content.recordList.length) {
        notification.info({
          message: '温馨提示',
          description: '暂无日志记录',
        });
        return;
      }
      yield put({
        type: 'save',
        payload: {
          logDetail: { show: true, data: content.recordList },
        },
      });
    },
    *fetchGetMreTag({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetMreTag, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.tagNames);
    },
    *fetchGetPhoneComeLocation({ payload, callback }, { call }) {
      const response = yield call(fetchGetPhoneComeLocation, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content);
    },
    *fetchGetTradeSelect({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetTradeSelect, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.categoryIds);
    },
    *fetchGetHubName({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetHubName, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.businessHubList);
    },
    *fetchSetTradeSelect({ payload, callback }, { call, put }) {
      const response = yield call(fetchSetTradeSelect, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '设置成功',
      });
      callback();
    },
    *fetchMerCheckData({ payload, callback }, { call }) {
      const response = yield call(fetchMerCheckData, payload);
      if (!response) return;
      callback(response.content);
    },
    *fetchGetFreeCouponSelect({ payload }, { call, put }) {
      const response = yield call(fetchGetFreeCouponSelect, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          couponList: { list: content.ownerCouponList, total: content.total },
        },
      });
    },
    *fetchGetBuyCouponSelect({ payload }, { call, put }) {
      const response = yield call(fetchGetBuyCouponSelect, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          buyCoupon: { list: content.ownerCouponList, total: content.total },
        },
      });
    },
    *fetchGetSpecialGoodsSelect({ payload }, { call, put }) {
      const response = yield call(fetchGetSpecialGoodsSelect, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          specialGoods: { list: content.specialGoodsList, total: content.total },
        },
      });
    },
    *fetchimportExcel({ payload, callback }, { call }) {
      const response = yield call(fetchimportExcel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '导出成功',
      });
      callback && callback();
    },
    *fetchimportExcelList({ payload }, { call, put }) {
      const response = yield call(fetchimportExcelList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          excelList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchGetSelectUserList({ payload }, { call, put }) {
      const response = yield call(fetchGetSelectUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userList: content.recordList,
        },
      });
    },
  },
};
