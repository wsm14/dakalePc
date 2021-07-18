import { notification } from 'antd';
import oss from 'ali-oss';
import { uuid } from '@/utils/utils';
import {
  fetchGetOss,
  fetchActiveAdd,
  fetchActiveEdit,
  fetchSourceMerchant,
  fetchSourceGoods,
  fetchActiveList,
} from '@/services/ActiveServices';

export default {
  namespace: 'activeTemplate',

  state: {
    merList: { list: [], total: 0 },
    goodsList: { list: [], total: 0 },
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
    *fetchGetOss({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetOss, { uploadType: 'resource', fileType: 'html' });
      if (!response) return;
      const { folder, host, securityToken: stsToken } = response.content;
      const client = new oss({ region: 'oss-cn-hangzhou', stsToken, ...response.content });
      let _fileRath = `${folder}/${uuid()}.html`;
      client.put(_fileRath, payload.file).then((res) => {
        const { status, statusCode } = res.res;
        if (status === 200 && statusCode === 200) {
          callback(host + _fileRath);
          notification.info({
            message: '温馨提示',
            description: '上传成功',
          });
        } else {
          notification.info({
            message: '温馨提示',
            description: '上传失败',
          });
        }
      });
    },
    *fetchActiveEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchActiveEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改活动成功',
      });
      callback();
    },
    *fetchSourceMerchant({ payload, callback }, { call }) {
      const response = yield call(fetchSourceMerchant, payload);
      if (!response) return;
      const { content } = response;
      callback({ list: content.recordList, total: content.total });
    },
    *fetchActiveList({ payload, callback }, { call }) {
      const response = yield call(fetchActiveList, payload);
      if (!response) return;
      const { content } = response;
      callback({ list: content.recordList, total: content.total });
    },
    *fetchSourceGoods({ payload, callback }, { call }) {
      const response = yield call(fetchSourceGoods, payload);
      if (!response) return;
      const { content } = response;
      callback({ list: content.recordList, total: content.total });
    },
  },
};
