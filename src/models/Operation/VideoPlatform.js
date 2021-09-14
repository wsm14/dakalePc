import { notification } from 'antd';
import cityJson from '@/common/cityJson';
import { SHARE_AREA_TYPE } from '@/common/constant';
import {
  fetchNewShareList,
  fetchNewShareNoAudit,
  fetchNewShareDel,
  fetchNewSharePush,
  fetchNewShareClose,
  fetchNewShareDetail,
  fetchNewShareRewardSet,
  fetchNewShareRewardSave,
  fetchNewShareRewardCancel,
} from '@/services/OperationServices';

export default {
  namespace: 'videoPlatform',

  state: {
    list: { list: [], total: 0 },
    rewardList: { list: [], total: 0 },
    couponList: { list: [], total: 0 },
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
      const response = yield call(fetchNewShareList, payload);
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
    *fetchNewShareRewardSetList({ payload }, { call, put }) {
      const response = yield call(fetchNewShareRewardSet, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          rewardList: {
            list: content.tippingList,
            total: content.total,
          },
        },
      });
    },
    *fetchNewSharePush({ payload, callback }, { call }) {
      const response = yield call(fetchNewSharePush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分享发布成功',
      });
      callback();
    },
    *fetchNewShareNoAudit({ payload, callback }, { call }) {
      const response = yield call(fetchNewShareNoAudit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `修改成功`,
      });
      callback();
    },
    *fetchNewShareClose({ payload, callback }, { call }) {
      const response = yield call(fetchNewShareClose, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分享下架成功',
      });
      callback();
    },
    *fetchNewShareDel({ payload, callback }, { call }) {
      const response = yield call(fetchNewShareDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分享删除成功',
      });
      callback();
    },
    *fetchNewShareRewardSave({ payload, callback }, { call }) {
      const response = yield call(fetchNewShareRewardSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `打赏创建成功`,
      });
      callback();
    },
    *fetchNewShareRewardCancel({ payload, callback }, { call }) {
      const response = yield call(fetchNewShareRewardCancel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '取消打赏成功',
      });
      callback();
    },
    *fetchNewShareDetail({ payload, callback }, { call }) {
      const response = yield call(fetchNewShareDetail, payload);
      if (!response) return;
      const { content } = response;
      const {
        area,
        areaType,
        freeOwnerCouponList = [], // 免费券
        ownerCouponList = [], // 有价券
        activityGoodsList = [], // 特惠商品
        promotionType: pType,
        videoContent,
        ...ohter
      } = content.momentDetail;
      const newObj = {
        ...ohter,
        promotionList: [
          ...freeOwnerCouponList.map((item) => ({ ...item, type: 'free' })),
          ...ownerCouponList.map((item) => ({ ...item, type: 'valuable' })),
          ...activityGoodsList.map((item) => ({ ...item, type: 'special' })),
        ],
        videoContent: JSON.parse(videoContent || '{}'),
        area:
          areaType !== 'all'
            ? areaType === 'near'
              ? `附近 ${Number(area) / 1000} km`
              : (area ? area.split(',') : [])
                  .map((item) => {
                    const cityIndex = cityJson.findIndex((city) => city.id === item);
                    if (cityIndex > -1) {
                      return cityJson[cityIndex].name;
                    }
                  })
                  .toString()
            : SHARE_AREA_TYPE[areaType],
      };
      callback(newObj);
    },
  },
};
