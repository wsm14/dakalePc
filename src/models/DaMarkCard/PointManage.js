import { notification } from 'antd';
import {
  fetchListHittingMain,
  fetchSaveHittingMain,
  fetchUpdateHittingMain,
  fetchGetHittingMainById,
  fetchListHittingRecordManagement,
  fetchListHitting,
  fetchSaveHitting,
  fetchUpdateHitting,
  fetchGetHittingById,
  fetchGetStrapContent,
  fetchSetStrapContent,
  fetchSetHittingReward,
  fetchGetHittingRewardByMainId,
  fetchGetHasHitting,
} from '@/services/DaMarkCardServices';

export default {
  namespace: 'pointManage',

  state: {
    list: {
      list: [],
      total: 0,
    },
    markInfoList: {
      list: [],
      total: 0,
    },
    pointList: {
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
    //  哒小卡点位主体-列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchListHittingMain, payload);
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
    // 哒小卡点位主体-新增
    *fetchSaveHittingMain({ payload, callback }, { call }) {
      const response = yield call(fetchSaveHittingMain, payload);
      if (!response) return;
      const { content } = response;
      notification.success({
        message: '温馨提示',
        description: '主体新增成功',
      });
      callback && callback(content);
    },
    // 哒小卡点位主体-编辑
    *fetchUpdateHittingMain({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateHittingMain, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '主体编辑成功',
      });
      callback && callback();
    },
    // 哒小卡点位主体-详情
    *fetchGetHittingMainById({ payload, callback }, { call }) {
      const response = yield call(fetchGetHittingMainById, payload);
      if (!response) return;
      const { content } = response;

      callback && callback(content.hittingMainDTO || {});
    },
    // get 哒小卡主体点位管理 - 打卡明细
    *fetchListHittingRecordManagement({ payload }, { call, put }) {
      const response = yield call(fetchListHittingRecordManagement, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          markInfoList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    // get 哒小卡点位 - 列表
    *fetchListHitting({ payload }, { call, put }) {
      const response = yield call(fetchListHitting, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          pointList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    // 哒小卡点位-新增
    *fetchSaveHitting({ payload, callback }, { call }) {
      const response = yield call(fetchSaveHitting, payload);
      if (!response) return;
      const { content = {} } = response;
      notification.success({
        message: '温馨提示',
        description: '点位新增成功',
      });
      callback && callback(content);
    },
    // 哒小卡点位-编辑
    *fetchUpdateHitting({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateHitting, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '点位编辑成功',
      });
      callback && callback();
    },
    // 哒小卡点位-详情
    *fetchGetHittingById({ payload, callback }, { call }) {
      const response = yield call(fetchGetHittingById, payload);
      if (!response) return;
      const { content } = response;

      callback && callback(content.hittingDTO || {});
    },
    // 哒小卡点位主体 - 首刷视频 - 详情
    *fetchGetStrapContent({ payload, callback }, { call }) {
      const response = yield call(fetchGetStrapContent, payload);
      if (!response) return;
      const { content } = response;

      callback && callback(content.videoContentObject || {});
    },
    // get 哒小卡点位主体 - 首刷视频 - 设置
    *fetchSetStrapContent({ payload, callback }, { call }) {
      const response = yield call(fetchSetStrapContent, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '设置视频成功',
      });
      callback && callback();
    },
    // get 哒小卡点位主体 - 奖励 - 设置
    *fetchSetHittingReward({ payload, callback }, { call }) {
      const response = yield call(fetchSetHittingReward, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '设置奖励成功',
      });
      callback && callback();
    },
    // get 哒小卡点位主体 - 奖励 - 详情
    *fetchGetHittingRewardByMainId({ payload, callback }, { call }) {
      const response = yield call(fetchGetHittingRewardByMainId, payload);
      if (!response) return;
      const { content } = response;
      const { hittingRewardDTO = {} } = content;
      const {
        hittingRewardObject = {}, // 卡豆配置
        hittingRewardRightGoodsObject = {}, // 平台权益商品
        hittingRewardOnlineGoodsObject = {}, // 电商品
        hittingRewardActualGoodsObject = {}, // 自提商品
      } = hittingRewardDTO;
      const { timeRange = '' } = hittingRewardObject;

      const isNoObj = (obj) => Object.keys(obj).length;

      const data = {
        ...hittingRewardObject,
        hittingRewardRightGoodsObject,
        hittingRewardOnlineGoodsObject,
        hittingRewardActualGoodsObject,
        goodsObject: [
          isNoObj(hittingRewardRightGoodsObject) && 'hittingRewardRightGoodsObject',
          isNoObj(hittingRewardOnlineGoodsObject) && 'hittingRewardOnlineGoodsObject',
          isNoObj(hittingRewardActualGoodsObject) && 'hittingRewardActualGoodsObject',
        ],
        specialTime: timeRange ? 'fixedTime' : 'all',
        timeRangeStart: Number(timeRange.split('-')[0]),
        timeRangeEnd: Number(timeRange.split('-')[1]),
      };

      callback && callback(data || {});
    },
    //点击奖励按钮，判断是否该主体是否已关联点位
    *fetchGetHasHitting({ payload, callback }, { call }) {
      const response = yield call(fetchGetHasHitting, payload);
      if (!response) return;
      const {content={}}=response
      callback && callback(content.hasHitting );
    },
  },
};
