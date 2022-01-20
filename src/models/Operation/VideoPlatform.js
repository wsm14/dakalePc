import { notification } from 'antd';
import moment from 'moment';
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
  fetchUGCVideoBeanRules,
  fetchUGCVideoBeanRulesSet,
  fetchUGCVideoRulesSet,
  fetchUGCVideoList,
  fetchUGCVideoRewardInfo,
  fetchVideoFakeList,
  fetchNewShareStatisticsList,
  fetchVideoFakeListAdd,
  fetchVideoFakeListEdit,
} from '@/services/OperationServices';

export default {
  namespace: 'videoPlatform',

  state: {
    list: { list: [], total: 0 },
    UGCList: { list: [], total: 0 },
    rewardList: { list: [], total: 0 },
    couponList: { list: [], total: 0 },
    infoList: { list: [], total: 0, sumRewardBean: 0 },
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
    // 仿真数据编辑修改
    *fetchVideoFakeListEdit({ payload, callback }, { call }) {
      const response = yield call(fetchVideoFakeListEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `提交修改成功`,
      });
      callback();
    },
    // 仿真数据配置
    *fetchVideoFakeListAdd({ payload, callback }, { call }) {
      const response = yield call(fetchVideoFakeListAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `提交修改成功`,
      });
      callback();
    },
    // 获取视频仿真数据
    *fetchVideoFakeList({ payload: { momentId, ownerId }, callback }, { call, put }) {
      const response = yield call(fetchVideoFakeList, { momentId, ownerId });
      if (!response) return;
      const { content } = response;
      console.log('content', content);
      const { collection = [], share = [], reward = [] } = content;

      const collectionNew = collection.map((itemScan) => ({
        ...itemScan,
        time: [moment(itemScan.beginTime, 'YYYY-MM-DD'), moment(itemScan.endTime, 'YYYY-MM-DD')],
      }));
      const shareNew = share.map((itemVer) => ({
        ...itemVer,
        time: [moment(itemVer.beginTime, 'YYYY-MM-DD'), moment(itemVer.endTime, 'YYYY-MM-DD')],
      }));
      const rewardNew = reward.map((itemPro) => ({
        ...itemPro,
        time: [moment(itemPro.beginTime, 'YYYY-MM-DD'), moment(itemPro.endTime, 'YYYY-MM-DD')],
      }));

      //收藏数
      const collectionList = {
        collection: collectionNew,
      };
      //分享数
      const shareList = {
        share: shareNew,
      };
      // 打赏卡豆数
      const rewardList = {
        reward: rewardNew,
      };
      const newDetail = {
        ...content,
        collectionList,
        shareList,
        rewardList,
      };
      callback(newDetail);
    },
    // UGC视频打赏明细
    *fetchUGCVideoRewardInfo({ payload }, { call, put }) {
      const response = yield call(fetchUGCVideoRewardInfo, payload);
      if (!response) return;
      const { content } = response;
      console.log(content, 'content');
      yield put({
        type: 'save',
        payload: {
          infoList: {
            list: content.recordList,
            total: content.total,
            sumRewardBean: content.sumRewardBean,
          },
        },
      });
    },
    // 获取商家视频列表
    *fetchMerchVideoList({ payload }, { call, put }) {
      const response = yield call(fetchUGCVideoList, payload);
      if (!response) return;
      const { content } = response;
      // console.log(content, 'content');
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
    // 获取UGC视频列表
    *fetchUGCVideoList({ payload }, { call, put }) {
      const response = yield call(fetchUGCVideoList, payload);
      if (!response) return;
      const { content } = response;
      // console.log(content, 'content');
      yield put({
        type: 'save',
        payload: {
          UGCList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchUGCVideoBeanRulesSet({ payload, payload2, callback }, { call }) {
      // UGC视频平台奖励卡豆规则设置
      const response = yield call(fetchUGCVideoBeanRulesSet, payload);
      // UGC视频打赏规则设置
      const response2 = yield call(fetchUGCVideoRulesSet, payload2);
      if (!response && !response2) return;
      notification.success({
        message: '温馨提示',
        description: '设置成功',
      });
      callback();
    },
    *fetchUGCVideoBeanRules({ callback }, { call, put }) {
      // 读取UGC视频平台奖励卡豆规则
      const response = yield call(fetchUGCVideoBeanRules, {
        parent: 'ugcMoment',
        child: 'platformRewardBeanRule',
      });
      // 读取UGC视频打赏规则
      const response2 = yield call(fetchUGCVideoBeanRules, {
        parent: 'ugcMoment',
        child: 'rewardRule',
      });
      if (!response && !response2) return;
      const { content } = response;
      const { content: rule } = response2;
      callback({
        beanRule: JSON.parse(content.dictionary.extraParam),
        rewardRule: JSON.parse(rule.dictionary.extraParam),
      });
    },
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
    // 修改视频（不审核）
    // 商家、UGC视频设置收藏分享数
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
    // +UGC视频详情展示定位
    *fetchNewShareDetail({ payload, callback }, { call }) {
      const { type = 'info', momentType, ...cell } = payload;
      const response = yield call(fetchNewShareDetail, cell);
      // 查询视频统计信息
      let content2 = {};
      if (type === 'info') {
        const response2 = yield call(fetchNewShareStatisticsList, { momentType, ...cell });
        if (!response2) return;
        const { content } = response2;
        content2 = content;
      }
      if (!response) return;
      const { content } = response;
      // console.log(content, 'content');
      const {
        age,
        area,
        areaType,
        tagsId,
        freeOwnerCouponList = [], // 免费券
        ownerCouponList = [], // 有价券
        activityGoodsList = [], // 特惠商品 / 电商商品
        // addressContentList = [], // 定位
        ugcAddressObject, // UGC定位
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
        ...content2,
        age,
        area,
        areaType,
        // address: addressContentList[0]?.address || '',
        address: ugcAddressObject?.address,
        promotionList: [
          ...freeOwnerCouponList.map((item) => ({ ...item, type: 'free' })),
          ...ownerCouponList.map((item) => ({ ...item, type: 'valuable' })),
          ...activityGoodsList
            .filter((it) => it.activityType === 'specialGoods')
            .map((item) => ({ ...item, type: 'special' })),
          ...activityGoodsList
            .filter((it) => it.activityType === 'commerceGoods')
            .map((item) => ({ ...item, type: 'commer' })),
        ],
        videoContent: JSON.parse(videoContent || '{}'),
        ...editData,
      };
      callback(newObj);
    },
  },
};
