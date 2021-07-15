import { notification } from 'antd';
import { fetchInviteImgList, fetchInviteImgSave } from '@/services/SystemServices';

export default {
  namespace: 'globalConfig',

  state: {
    list: [],
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
    *fetchInviteImgList({ payload }, { call, put }) {
      const response = yield call(fetchInviteImgList, payload);
      if (!response) return;
      const { content } = response;
      console.log(response,"ddd")
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       list: content.locationCityList,
    //     },
    //   });
    },
    *fetchInviteImgSave({ payload, callback }, { call }) {
      const response = yield call(fetchInviteImgSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '图片上传成功',
      });
      callback();
    },
  },
};
