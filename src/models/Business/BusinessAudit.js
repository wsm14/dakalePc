import moment from 'moment';
import { notification } from 'antd';
import {
  fetchMerchantAuditList,
  fetchMerchantAuditDetailList,
  fetchMerchantAuditDetail,
  fetchMerSaleAudit,
  fetchMerSaleAuditAllow,
  fetchWaitBusinessHub,
} from '@/services/BusinessServices';

export default {
  namespace: 'businessAudit',

  state: {
    list: { list: [], total: 0 },
    detailList: {
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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMerchantAuditList, payload);
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
    *fetchGetDetailList({ payload }, { call, put }) {
      const response = yield call(fetchMerchantAuditDetailList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchWaitBusinessHub({ payload, callback }, { call, put }) {
      const response = yield call(fetchWaitBusinessHub, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          hubList: content.businessHubList,
        },
      });
      callback(content.businessHubList);
    },
    *fetchMerchantAuditDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantAuditDetail, payload);
      if (!response) return;
      const { content } = response;
      const {
        provinceCode: p,
        cityCode: c,
        districtCode: d,
        provinceName: pN,
        cityName: cN,
        districtName: dN,
        categoryNode,
        brandName,
        bondBean,
        commissionRatio,
        topCategoryName,
        categoryName,
        businessTime,
        tags,
      } = content.userMerchantVerify;
      const categoryNodeArr = categoryNode.split('.');
      const initialValues = {
        ...content.userMerchantVerify,
        provinceCode: [p, c, d],
        selectCity: [
          { value: p, label: pN },
          { value: c, label: cN },
          { value: d, label: dN },
        ],
        businessTimeObj: businessTime,
        businessTime: Object.assign(
          ...businessTime.split(',').map((item, i) => {
            const timeArr = item.split('-');
            return {
              [`item5${i + 1}`]: [moment(timeArr[0], 'HH:mm'), moment(timeArr[1], 'HH:mm')],
            };
          }),
        ),
        topCategoryId: categoryNodeArr[0],
        topCategoryName: [categoryNodeArr[0], categoryNodeArr[1]],
        otherBrand: brandName === '' ? false : brandName === '其他品牌' ? true : false,
        bondBean: { value: bondBean, key: commissionRatio },
        categoryName: [
          { categoryIdString: categoryNodeArr[0], categoryName: topCategoryName },
          { categoryIdString: categoryNodeArr[1], categoryName: categoryName },
        ],
        commissionRatio: bondBean,
        tags: tags.split(','),
      };
      callback(initialValues);
    },
    *fetchMerSaleAudit({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerSaleAudit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家审核驳回成功',
      });
      callback();
    },
    *fetchMerSaleAuditAllow({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerSaleAuditAllow, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家审核通过成功',
      });
      callback();
    },
  },
};
