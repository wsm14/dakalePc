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
  fetchNewShareAuditEdit,
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
    *fetchNewShareAuditEdit({ payload, callback }, { call }) {
      const response = yield call(fetchNewShareAuditEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `提交修改审核成功`,
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
      const { type = 'info', ...cell } = payload;
      const response = yield call(fetchNewShareDetail, cell);
      if (!response) return;
      const { content } = response;
      const {
        age,
        area,
        areaType,
        tagsId,
        freeOwnerCouponList = [], // 免费券
        ownerCouponList = [], // 有价券
        activityGoodsList = [], // 特惠商品
        videoContent,
        ...ohter
      } = content.momentDetail;
      const editData =
        type !== 'info'
          ? {
              videoUrl: JSON.parse(videoContent || '{}').url,
              videoId: JSON.parse(videoContent || '{}').videoId,
              categoryNode: [ohter.topCategoryIdString, ohter.categoryIdString],
              free: freeOwnerCouponList[0] || {},
              contact: [...activityGoodsList, ...ownerCouponList],
              age: age !== '0-100' ? 'age' : age,
              ageData: age !== '0-100' ? age.split(',') : [],
              taste: tagsId ? 'tag' : 'all',
              tagsId: tagsId ? tagsId?.split(',') : [],
              area: {
                all: '',
                city: [],
                district: [],
                near: area,
              }[areaType],
              cityList: {
                all: [],
                city: area.split(',').map((i) => ({ city: [i.slice(0, 2), i.slice(0, 4)] })),
                district: area.split(',').map((i) => ({ city: [i.slice(0, 2), i.slice(0, 4), i] })),
                near: [],
              }[areaType],
            }
          : {};
      const newObj = {
        ...ohter,
        age,
        area,
        areaType,
        promotionList: [
          ...freeOwnerCouponList.map((item) => ({ ...item, type: 'free' })),
          ...ownerCouponList.map((item) => ({ ...item, type: 'valuable' })),
          ...activityGoodsList.map((item) => ({ ...item, type: 'special' })),
        ],
        videoContent: JSON.parse(videoContent || '{}'),
        ...editData,
      };
      callback(newObj);
    },
  },
};
