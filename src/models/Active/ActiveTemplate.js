import { notification } from 'antd';
import oss from 'ali-oss';
import {
  fetchGetOss,
  fetchActiveAdd,
  fetchActiveEdit,
  fetchCouponSelect,
  fetchGetMreConfigInfo,
  fetchCommerceGoodsSelect,
} from '@/services/ActiveServices';

export default {
  namespace: 'activeTemplate',

  state: {
    commerceGoods: { list: [], total: 0 },
    coupon: { list: [], total: 0 },
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
    *fetchGetOss({ payload, callback }, { call }) {
      const response = yield call(fetchGetOss, { uploadType: 'resource', fileType: 'html' });
      if (!response) return;
      const { folder, host, securityToken: stsToken } = response.content;
      const client = new oss({ region: 'oss-cn-hangzhou', stsToken, ...response.content });
      let _fileRath = `${folder}/${payload.show}/${payload.fileName}.html`;
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
    // 电商商品
    *fetchCommerceGoodsSelect({ payload }, { call, put }) {
      const response = yield call(fetchCommerceGoodsSelect, {
        activityType: 'commerceGoods',
        ...payload,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          commerceGoods: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchCouponSelect({ payload }, { call, put }) {
      const response = yield call(fetchCouponSelect, payload);
      if (!response) return;
      const { content } = response;
      const { ownerId } = payload;
      yield put({
        type: 'save',
        payload: {
          coupon: {
            list: content.ownerCouponDTOList.map((i) => ({ ...i, ownerId })),
            total: content.ownerCouponDTOList.length,
          },
        },
      });
    },
    *fetchGetMreConfigInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetMreConfigInfo, payload);
      if (!response) return;
      const { content = {} } = response;
      for (const key in content) {
        if (!content[key] || (Array.isArray(content[key]) && !content[key].length)) {
          delete content[key];
        }
      }
      callback(content);
    },
    *fetchActiveAdd({ payload, callback }, { call }) {
      const response = yield call(fetchActiveAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '创建成功',
      });
      callback();
    },
    *fetchActiveEdit({ payload, callback }, { call }) {
      const response = yield call(fetchActiveEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
      });
      callback();
    },
  },
};
