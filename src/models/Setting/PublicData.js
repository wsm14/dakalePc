import { notification } from 'antd';
import oss from 'ali-oss';
import lodash from 'lodash';
import { uuid } from '@/utils/utils';
import { fetchMerchantList, fetchMerchantGroup } from '@/services/BusinessServices';
import {
  fetchGetOss,
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
  fetchGetGroupForSearch,
  fetchSkuAvailableMerchant,
  fetchGoodsTagListByCategoryId,
  fetchGoodsIsCommission,
  fetchSkuDetailMerchantList,
  fetchAuditMerchantList,
  fetchGetCouponsSearch,
  fetchGetGoodsSearch,
  fetchListImportSubsidyRole,
  fetchListUserByIds,
  fetchGetPlatformEquitySelect,
  fetchGetEquityCouponSelect,
  fetchPlatformCouponSelect,
  fetchListHitting,
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
    groupList: [],
    ruleBean: 0,
    experLevel: {},
    groupMreList: [],
    skuMerchantList: { list: [], total: 0 },
    CouponListSearch: [],
    goodsList: [],
    platformEquity: { list: [], total: 0 },
    EquityCoupon: { list: [], total: 0 },
    PlatformCoupon: { list: [], total: 0 },
    pointList: { list: [], total: 0 },
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
    clearPlatformEquity(state) {
      return {
        ...state,
        platformEquity: { list: [], total: 0 },
      };
    },
  },

  effects: {
    /**
     * @param {Object} payload
     * file 文件
     * folderName 文件夹名称 materials 营销物料
     * fileType 文件类型 zip image html ...
     * extension 文件后缀名称
     * @param {Function} callback 回调函数 发挥文件url
     * @returns url
     */
    *fetchGetOssUploadFile({ payload, callback }, { call }) {
      const response = yield call(fetchGetOss, {
        uploadType: 'resource',
        fileType: payload.fileType,
      });
      if (!response) return;
      const { folder, host, securityToken: stsToken } = response.content;
      const client = new oss({ region: 'oss-cn-hangzhou', stsToken, ...response.content });
      let _fileRath = `${folder}/${payload.folderName}/${uuid()}${payload.extension}`;
      client.put(_fileRath, payload.file).then((res) => {
        const { status, statusCode } = res.res;
        if (status === 200 && statusCode === 200) {
          callback(host + _fileRath);
        } else {
          notification.info({
            message: '温馨提示',
            description: '上传失败',
          });
        }
      });
    },
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
    *fetchGetJumpNative({ payload, callback }, { call, put }) {
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
      callback && callback();
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
    // 特惠商品
    *fetchGetSpecialGoodsSelect({ payload }, { call, put }) {
      const response = yield call(fetchGetSpecialGoodsSelect, {
        activityType: 'specialGoods',
        ...payload,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          specialGoods: { list: content.specialGoodsList, total: content.total },
        },
      });
    },
    // 权益商品
    *fetchGetPlatformEquitySelect({ payload }, { call, put }) {
      const response = yield call(fetchGetPlatformEquitySelect, {
        activityType: 'specialGoods', // 限制特惠商品搜索到电商商品
        ...payload,
        goodsStatus: 1,
        status: 1,
        adminFlag: 1,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          platformEquity: { list: content.recordList, total: content.total },
        },
      });
    },
    // 电商商品
    *fetchGetPlatformCommerceGoodsSelect({ payload }, { call, put }) {
      const response = yield call(fetchGetPlatformEquitySelect, {
        activityType: 'commerceGoods',
        ...payload,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          platformEquity: { list: content.recordList, total: content.total },
        },
      });
    },
    // 权益券
    *fetchGetEquityCouponSelect({ payload }, { call, put }) {
      const response = yield call(fetchGetEquityCouponSelect, {
        ...payload,
        adminFlag: 1,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          EquityCoupon: { list: content.recordList, total: content.total },
        },
      });
    },

    // 平台券
    *fetchPlatformCouponSelect({ payload }, { call, put }) {
      const response = yield call(fetchPlatformCouponSelect, {
        ...payload,
        adminFlag: 1,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          PlatformCoupon: { list: content.recordList, total: content.total },
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
    *fetchGetUsersSearch({ payload, callback }, { call, put }) {
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
      callback && callback(content.userDTOS);
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
            option: item,
          })),
        },
      });
    },
    *fetchGetGroupForSearch({ payload }, { put, call }) {
      const response = yield call(fetchGetGroupForSearch, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          groupList: content.merchantGroupDTOS.map((item) => ({
            name: `${item.groupName} ${item.account}`,
            otherData: item.address,
            value: item.merchantGroupIdString,
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
        { limit: 50, page: 1, bankStatus: 3, ...newPayload, ...other },
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
        districtCode: item.districtCode,
        businessStatus: item.businessStatus || '1',
        status: item.status || '1',
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
      callback(content);
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
    *fetchListImportSubsidyRole({ payload, callback }, { put, call }) {
      const response = yield call(fetchListImportSubsidyRole, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content);
    },
    *fetchListUserByIds({ payload, callback }, { put, call }) {
      const response = yield call(fetchListUserByIds, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content.userDTOS);
    },
    //get 搜索打卡点位
    *fetchListHitting({ payload }, { put, call }) {
      const response = yield call(fetchListHitting, { page: 1, limit: 10, ...payload });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          pointList: {
            list: content.recordList.map((item) => ({
              name: `${item.name}`,
              value: item.hittingId,
            })),
            total: content.total,
          },
        },
      });
    },
  },
};
