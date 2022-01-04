import { notification } from 'antd';
import {
  fetchListGiftType,
  fetchCreateGiftType,
  fetchUpdateGiftType,
  fetchGetGiftTypeById,
  fetchCreatePlatformGiftPack,
  fetchUpdatePlatformGiftPack,
  fetchPagePlatformGiftPack,
  fetchGetPlatformGiftPackDetail,
} from '@/services/OperationServices';
import moment from 'moment';

export default {
  namespace: 'SpreeManage',

  state: {
    list: {
      list: [],
      total: 0,
    },
    giftTypeList: [],
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
      const response = yield call(fetchPagePlatformGiftPack, payload);
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
    // 礼包类型 - 获取
    *fetchListGiftType({ payload, callback }, { call, put }) {
      const response = yield call(fetchListGiftType, payload);
      if (!response) return;
      const { content } = response;

      yield put({
        type: 'save',
        payload: {
          giftTypeList: content.giftTypeDTOS.map((item) => ({
            ...item,
            typeValue: `${item.typeName} ${item.giftTypeId}`,
          })),
        },
      });
      callback && callback(content.giftTypeDTOS);
    },
    // 礼包类型 - 新增
    *fetchCreateGiftType({ payload, callback }, { call }) {
      const response = yield call(fetchCreateGiftType, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增礼包类型成功',
      });
      callback && callback();
    },
    // 礼包类型 - 修改
    *fetchUpdateGiftType({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateGiftType, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改礼包类型成功',
      });
      callback && callback();
    },
    // 礼包类型 - 详情
    *fetchGetGiftTypeById({ payload, callback }, { call }) {
      const response = yield call(fetchGetGiftTypeById, payload);
      if (!response) return;
      const { content } = response;

      callback && callback(content.giftTypeDTO);
    },
    // 礼包 - 新增
    *fetchCreatePlatformGiftPack({ payload, callback }, { call }) {
      const response = yield call(fetchCreatePlatformGiftPack, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '礼包新增成功',
      });
      callback && callback();
    },
    // 礼包 - 编辑
    *fetchUpdatePlatformGiftPack({ payload, callback }, { call }) {
      const response = yield call(fetchUpdatePlatformGiftPack, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '礼包修改成功',
      });
      callback && callback();
    },
    // 礼包 - 详情
    *fetchGetPlatformGiftPackDetail({ payload, callback }, { call }) {
      const response = yield call(fetchGetPlatformGiftPackDetail, payload);
      if (!response) return;
      const { content } = response;
      const { platformGiftPackDetail } = content;
      const { getRuleObject, activeDate, paymentModeObject, buyFlag, ...other } =
        platformGiftPackDetail;

      const data = {
        ...other,
        ...getRuleObject,
        activeDate: [moment(activeDate, 'YYYY-DD-MM'), moment(endDate, 'YYYY-DD-MM')],
        buyFlagType: paymentModeObject.type === 'self' ? '2' : buyFlag == '0' ? '0' : '1',
        bean: paymentModeObject.type === 'self' && paymentModeObject.bean,
        buyPrice: paymentModeObject.type === 'self' && paymentModeObject.cash,
      };

      console.log(content.platformGiftPackDetail);
      return;
      callback && callback(content.platformGiftPackDetail);
    },
  },
};
