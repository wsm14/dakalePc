import { notification } from 'antd';
import lodash from 'lodash';
import { fetchMerchantList, fetchMerchantGroup } from '@/services/BusinessServices';
import {
  fetchGetMreTag,
  fetchImportExcel,
  fetchGetTasteTag,
  fetchGetKolLevel,
  fetchGetHubSelect,
  fetchHandleDetail,
  fetchGetLogDetail,
  fetchMerCheckData,
  fetchGetJumpNative,
  fetchGetExpertLevel,
  fetchImportExcelList,
  fetchGetPropertyJSON,
  fetchGetSubsidyRoleBean,
  fetchGetBuyCouponSelect,
  fetchGetFreeCouponSelect,
  fetchGetPhoneComeLocation,
  fetchGetSpecialGoodsSelect,
  fetchGetMerchantsSearch,
  fetchGetUsersSearch,
  fetchSkuAvailableMerchant,
  fetchGoodsTagListByCategoryId,
  fetchGoodsIsCommission,
  fetchSkuDetailMerchantList,
  fetchAuditMerchantList,
  fetchGetCouponsSearch,
  fetchGetGoodsSearch,
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
    merchantList: [],
    ruleBean: 0,
    experLevel: {},
    groupMreList: [],
    skuMerchantList: { list: [], total: 0 },
    CouponListSearch: [],
    goodsList: [],
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
    clearGroupMre(state) {
      return {
        ...state,
        groupMreList: [],
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
    *fetchGetLogDetail({ payload, callback }, { call, put }) {
      const { key = '' } = payload;
      const response = yield call(fetchGetLogDetail, { ...payload, page: 1, limit: 999 });
      if (!response) return;
      let recordList = {};
      const { content } = response;
      if (key === 'audit') {
        if (!content.recordList.length) {
          notification.info({
            message: '温馨提示',
            description: '暂无审核记录',
          });
          callback && callback({});
          return;
        } else {
          recordList = {
            list: content.recordList,
            total: content.total,
          };
          callback && callback(recordList);
        }
      } else {
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
      }
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
    *fetchGetExpertLevel({ payload }, { call, put }) {
      const response = yield call(fetchGetExpertLevel, payload);
      if (!response) return;
      const { content } = response;
      const { userLevelList = [] } = content;
      const levelObj = {};
      const duplicate = (item) => {
        if (item.configUserLevelList && item.configUserLevelList.length) {
          lodash.flatMap(item.configUserLevelList, duplicate);
        } else {
          levelObj[item.level] = item.levelName;
        }
      };
      lodash.flatMap(userLevelList, duplicate);
      yield put({
        type: 'save',
        payload: {
          experLevel: levelObj,
        },
      });
    },
    *fetchImportExcel({ payload }, { call }) {
      const response = yield call(fetchImportExcel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '导出成功',
      });
    },
    *fetchImportExcelList({ payload }, { call, put }) {
      const response = yield call(fetchImportExcelList, payload);
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
    *fetchGetUsersSearch({ payload }, { call, put }) {
      const response = yield call(fetchGetUsersSearch, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userList: content.userDTOS.map((item) => ({
            ...item,
            tipInfo: `${item.mobile} ${item.beanCode}`,
          })),
        },
      });
    },
    *fetchGetMerchantsSearch({ payload }, { put, call }) {
      const response = yield call(fetchGetMerchantsSearch, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          merchantList: content.userMerchantDTOS.map((item) => ({
            name: `${item.merchantName} ${item.account}`,
            otherData: item.address,
            value: item.userMerchantIdString,
          })),
        },
      });
    },
    *fetchGetGroupMreList({ payload, callback }, { put, call }) {
      const { type = 'merchant', name, ...other } = payload;
      const newPayload = {
        merchant: { merchantName: name }, // 单店
        group: { groupName: name }, // 集团
      }[type];
      const response = yield call(
        { merchant: fetchMerchantList, group: fetchMerchantGroup }[type],
        { limit: 300, page: 1, bankStatus: 3, ...newPayload, ...other },
      );
      if (!response) return;
      const { content } = response;
      const listData = content.recordList.map((item) => ({
        name: `${item.merchantName || item.groupName} ${item.account || ''}`,
        otherData: item.address,
        value: item.userMerchantIdString || item.merchantGroupIdString,
        commissionRatio: item.commissionRatio,
        topCategoryName: [item.topCategoryName, item.categoryName],
        topCategoryId: [item.topCategoryIdString, item.categoryIdString],
      }));
      yield put({
        type: 'save',
        payload: {
          groupMreList: listData,
        },
      });
      callback && callback(listData);
    },
    // sku通用- sku挂靠商家列表
    *fetchSkuAvailableMerchant({ payload }, { call, put }) {
      const response = yield call(fetchSkuAvailableMerchant, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          skuMerchantList: { list: content.merchantList, total: content.total },
        },
      });
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
    *fetchSkuDetailMerchantList({ payload, callback }, { call, put }) {
      const response = yield call(fetchSkuDetailMerchantList, payload);
      if (!response) return;
      const { content } = response;
      callback(content.merchantList);
    },
    *fetchAuditMerchantList({ payload, callback }, { call }) {
      const response = yield call(fetchAuditMerchantList, payload);
      if (!response) return;
      const { content } = response;
      callback(content.merchantList);
    },
    *fetchGetCouponsSearch({ payload }, { put, call }) {
      const response = yield call(fetchGetCouponsSearch, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          CouponListSearch: content.ownerCouponList.map((item) => ({
            name: `${item.couponName}`,
            value: item.ownerCouponIdString,
          })),
        },
      });
    },
    *fetchGetGoodsSearch({ payload }, { put, call }) {
      const response = yield call(fetchGetGoodsSearch, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          goodsList: content.activityGoodsList.map((item) => ({
            name: `${item.goodsName}`,
            value: item.specialGoodsId,
          })),
        },
      });
    },
  },
};
