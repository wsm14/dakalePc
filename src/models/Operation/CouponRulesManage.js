import { notification } from 'antd';
import {
  fetchConponListCategory,
  fetchConponListMerchant,
  fetchConponListMerchantGroup,
} from '@/services/OperationServices';
import moment from 'moment';

export default {
  namespace: 'couponRulesManage',

  state: {
    categoryCascaderList: [],
    merGroList: {
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
    // get 券规则管理 - 店铺（单店、子门店）/集团列表 - 列表
    *fetchGetGroupMreList({ payload }, { put, call }) {
      const { type = 'merchant', name, ...other } = payload;
      const newPayload = {
        merchant: { merchantName: name }, // 单店
        group: { groupName: name }, // 集团
      }[type];
      const response = yield call(
        { merchant: fetchConponListMerchant, group: fetchConponListMerchantGroup }[type],
        { bankStatus: 3, ...newPayload, ...other },
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
  },
};
