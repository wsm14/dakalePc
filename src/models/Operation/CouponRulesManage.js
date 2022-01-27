import { notification } from 'antd';
import {
  fetchConponListCategory,
  fetchConponListMerchant,
  fetchConponListMerchantGroup,
  fetchListSpecialGoodsManagement,
  fetchCreateRule,
  fetchListRuleByPage,
  fetchUpdateRuleStatus,
  fetchRuleDetailPage,
  fetchRuleDetail,
} from '@/services/OperationServices';
import moment from 'moment';

export default {
  namespace: 'couponRulesManage',

  state: {
    list: { list: [], total: 0 },
    categoryCascaderList: [],
    merGroList: {
      list: [],
      total: 0,
    },
    specialGoodsList: { list: [], total: 0 },
    ruleDetailListObj: { ruleConditionsList: [], total: 0 },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearRuleDetailListObj(state) {
      return {
        ...state,
        ruleDetailListObj: {},
      };
    },
  },

  effects: {
    // get 券规则管理 - 列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchListRuleByPage, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    // get 券规则管理 - 行业设置 - 列表
    *fetchConponListCategory({ payload }, { call, put }) {
      const response = yield call(fetchConponListCategory, payload);
      if (!response) return;
      const { content } = response;

      yield put({
        type: 'save',
        payload: {
          categoryCascaderList: content.categoryDTOList,
        },
      });
    },
    // get 券规则管理 - 店铺（单店）/集团列表 - 列表
    *fetchGetGroupMreList({ payload }, { put, call }) {
      const { type = 'merchant', name, ...other } = payload;
      const newPayload = {
        merchant: { merchantName: name, businessStatus: 1, groupFlag: 0 }, // 单店
        group: { groupName: name }, // 集团
      }[type];
      const response = yield call(
        { merchant: fetchConponListMerchant, group: fetchConponListMerchantGroup }[type],
        { bankStatus: 3, status: 1, ...newPayload, ...other },
      );
      if (!response) return;
      const { content } = response;
      const data = content.recordList.map((item) => ({
        ...item,
        id: item.userMerchantIdString || item.merchantGroupIdString,
        name: item.merchantName || item.groupName,
        mobile: item.mobile || item.contactMobile,
        groupType: type === 'group' ? '集团' : item.groupId ? '子门店' : '单店',
      }));
      yield put({
        type: 'save',
        payload: {
          merGroList: {
            list: data,
            total: content.total,
          },
        },
      });
    },
    // 特惠商品
    *fetchListSpecialGoodsManagement({ payload }, { call, put }) {
      const response = yield call(fetchListSpecialGoodsManagement, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          specialGoodsList: { list: content.recordList, total: content.total },
        },
      });
    },
    // post 券规则管理 - 新增
    *fetchCreateRule({ payload, callback }, { call }) {
      const response = yield call(fetchCreateRule, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新建规则成功',
      });
      callback && callback();
    },
    // post 券规则管理 - 启用停用规则
    *fetchUpdateRuleStatus({ payload, callback }, { call }) {
      const { status } = payload;
      const response = yield call(fetchUpdateRuleStatus, payload);
      if (!response) return;

      notification.success({
        message: '温馨提示',
        description: status == 0 ? '禁用成功！' : '启用成功！',
      });
      callback && callback();
    },
    // get 券规则管理 - 详情 - 获取带有全部id的详情接口
    *fetchRuleDetail({ payload, callback }, { call }) {
      const response = yield call(fetchRuleDetail, payload);
      if (!response) return;
      const { content } = response;

      callback && callback(content.ruleDetail);
    },
    // get 券规则管理 - 详情 - 获取具体数据对象的详情接口
    *fetchRuleDetailPage({ payload, callback }, { call, put }) {
      const response = yield call(fetchRuleDetailPage, payload);
      if (!response) return;
      const { content } = response;

      const {
        categoryList, // 行业列表
        userMerchantList, // 店铺列表
        merchantGroupList, // 集团列表
        specialGoodsList, // 特惠
        reduceCouponList, // 有价券
        commerceGoodsList, // 电商品
        platformGoodsTagsList, // 平台商品标签
        merchantGoodsTagsList, // 商家商品标签
        subRuleType, // 子规则
      } = content.ruleDetail;

      const data = {
        ruleConditionsList:
          categoryList ||
          userMerchantList ||
          merchantGroupList ||
          reduceCouponList ||
          commerceGoodsList ||
          platformGoodsTagsList ||
          merchantGoodsTagsList ||
          specialGoodsList,
      };

      yield put({
        type: 'save',
        payload: {
          ruleDetailListObj: {
            ...content.ruleDetail,
            ...data,
          },
        },
      });
      callback &&
        callback({
          ...content.ruleDetail,
          ...data,
        });
    },
  },
};
