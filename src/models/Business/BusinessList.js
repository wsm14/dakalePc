import moment from 'moment';
import { notification } from 'antd';
import { fetchGetOcrLicense } from '@/services/PublicServices';
import {
  fetchMerchantList,
  fetchMerchantDetail,
  fetchMerSetBandCode,
  fetchMerchantStatus,
  fetchMerchantSet,
  fetchMerchantAdd,
  fetchMerchantEdit,
  fetchMerchantTotal,
  fetchMerchantExportExcel,
  fetchMerchantTotalCategory,
  fetchMerVerificationCodeSet,
} from '@/services/BusinessServices';

export default {
  namespace: 'businessList',

  state: {
    list: [],
    total: 0,
    totalData: { chartsLeft: {}, chartsRight: [] },
    brandList: { list: [], total: 0 },
    selectList: [],
    subsidyList: { list: [], total: 0 },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    close(state) {
      return {
        ...state,
        selectList: [],
      };
    },
  },

  effects: {
    *fetchGetList({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
          subsidyList: {
            list: content.recordList,
            total: content.total,
          },
          selectList: content.recordList.map((item) => ({
            name: item.merchantName,
            otherData: item.address,
            value: item.userMerchantIdString,
            commissionRatio: item.commissionRatio,
            topCategoryName: [item.topCategoryName, item.categoryName],
            topCategoryId: [item.topCategoryIdString, item.categoryIdString],
          })),
        },
      });
      if (callback) callback(content.recordList);
    },
    *fetchMerchantGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchMerchantExportExcel, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.recordList);
    },
    *fetchMerchantDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantDetail, payload);
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
        topCategoryName,
        categoryName,
        businessTime,
        property = '{}',
        headerContentObject = {},
        tag,
        scenesIds,
      } = content.merchantDetail;
      const { imageUrl } = headerContentObject;
      const categoryNodeArr = categoryNode.split('.');
      // 检查值
      const dataCheck = (key) => (JSON.parse(property)[key] ? JSON.parse(property)[key] || '' : '');
      const initialValues = {
        ...content.merchantDetail,
        headerImg: imageUrl,
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
        categoryName: [
          { categoryIdString: categoryNodeArr[0], categoryName: topCategoryName },
          { categoryIdString: categoryNodeArr[1], categoryName: categoryName },
        ],
        category: `${topCategoryName} - ${categoryName}`,
        citycodeArr: [p, c, d],
        property: property
          ? {
              service: dataCheck('service').split(','),
              speacial: dataCheck('speacial').split(','),
            }
          : '',
        tags: tag.split(','),
        scenesIds: scenesIds.split(','),
      };
      callback(initialValues);
    },
    *fetchBusinessTotal({ payload }, { call, put }) {
      const response = yield call(fetchMerchantTotal);
      const response2 = yield call(fetchMerchantTotalCategory, payload);
      if (!response && !response2) return;
      const { content } = response;
      const { content: content2 = {} } = response2;
      const {
        parentMerchant = 0,
        childMerchant = 0,
        merchantSettle = 0,
        categoryMerchantCount = [],
      } = content2;

      yield put({
        type: 'save',
        payload: {
          totalData: {
            chartsLeft: { ...content, parentMerchant, childMerchant, merchantSettle },
            chartsRight: categoryMerchantCount.length
              ? categoryMerchantCount
              : [{ categoryName: '无', count: 0 }],
          },
        },
      });
    },
    *fetchMerBusinessOcr({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOcrLicense, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchMerchantEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家修改成功',
      });
      callback();
    },
    *fetchMerSetBandCode({ payload }, { call, put }) {
      const response = yield call(fetchMerSetBandCode, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '开户行号设置成功',
      });
    },
    *fetchMerchantAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家新增成功',
      });
      callback();
    },
    *fetchMerchantSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家设置成功',
      });
      callback();
    },
    *fetchSetStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家店铺状态修改成功',
      });
      callback();
    },
    *fetchMerVerificationCodeSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerVerificationCodeSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '验证码设置成功',
      });
      callback();
    },
  },
};
