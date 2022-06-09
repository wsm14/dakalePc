import { notification } from 'antd';
import oss from 'ali-oss';
import { uuid } from '@/utils/utils';
import { fetchPlatformCouponSelect } from '@/services/ActiveServices';
import { fetchListOnlineGoodsByPage, fetchSpecialGoodsList } from '@/services/OperationServices';
import { fetchGetOss, fetchGetBuyCouponSelect } from '@/services/PublicServices';

export default {
  namespace: 'publicModels',

  state: {
    onlineGoods: { list: [], total: 0 },
    offlineGoods: { list: [], total: 0 },
    buyCouponList: { list: [], total: 0 },
    platformCoupon: { list: [], total: 0 },
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
    // get 获取线上电商品列表
    *fetchListOnlineGoodsByPage({ payload }, { call, put }) {
      const response = yield call(fetchListOnlineGoodsByPage, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          onlineGoods: {
            list: content.onlineManagerResps.map((i) => ({
              ...i,
              activityType: 'commerceGoods',
            })),
            total: content.total,
          },
        },
      });
    },
    // get 获取特惠商品列表
    *fetchListOfflineGoodsByPage({ payload }, { call, put }) {
      const response = yield call(fetchSpecialGoodsList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          offlineGoods: {
            list: content.offlineManagerResps.map((i) => ({
              ...i,
              activityType: 'specialGoods',
            })),
            total: content.total,
          },
        },
      });
    },
    // get 获取有价券列表
    *fetchGetBuyCouponList({ payload }, { call, put }) {
      const response = yield call(fetchGetBuyCouponSelect, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          buyCouponList: {
            list: content.ownerCouponList.map((i) => ({
              ...i,
              activityType: 'reduceCoupon',
              goodsId: i.ownerCouponIdString,
            })),
            total: content.total,
          },
        },
      });
    },
    // get 获取平台券列表
    *fetchGetPlatformCouponList({ payload }, { call, put }) {
      const response = yield call(fetchPlatformCouponSelect, {
        ...payload,
        adminFlag: 1,
      });
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          platformCoupon: {
            list: content.recordList.map((i) => ({
              ...i,
              activityType: 'platformCoupon',
              goodsId: i.platformCouponId,
            })),
            total: content.total,
          },
        },
      });
    },
  },
};
