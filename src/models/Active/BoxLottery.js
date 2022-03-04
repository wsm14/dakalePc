import { notification } from 'antd';
import {
  fetchBoxLotteryList,
  fetchGetLuckDrawRecord, //天天抽奖
  fetchBoxLotteryExport,
  fetchBoxDetail,
  fetchBoxAddAndPush,
  fetchListUserPackageManagement,
  fetchListUserPackageManagementExport,
  fetchGetUserPackageById,
  fetchDeliveryUserPackage,
  fetchListUserPackageManagementBean,
  fetchListUserPackageManagementBeanExport,
  fetchAllPrizeRecordExport,
} from '@/services/ActiveServices';

export default {
  namespace: 'boxLottery',

  state: {
    beanBoxList: {
      list: [],
      total: 0,
    },
    prizeList: {
      list: [],
      total: 0,
    },
    gameSignList: {
      list: [],
      total: 0,
    },
    gameEquityList: {
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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchBoxLotteryList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          beanBoxList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchGetLuckDrawRecord({ payload }, { call, put }) {
      const response = yield call(fetchGetLuckDrawRecord, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          prizeList: {
            list: content.prizeRecordList,
            total: content.total,
          },
        },
      });
    },
    *fetchAllPrizeRecordExport({payload, callback},{call}){
      const response = yield call(fetchAllPrizeRecordExport, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.allPrizeRecordList);
    },
    *fetchGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchBoxLotteryExport, payload);
      if (!response) return;
      const { content } = response;
      console.log(callback);
      if (callback) callback(content.userBlindBoxRewardDTOS);
    },
    *fetchBoxPushDetail({ payload, callback }, { call }) {
      const response = yield call(fetchBoxDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content?.logisticsInfo);
    },
    *fetchBoxAddAndPush({ payload, callback }, { call }) {
      const response = yield call(fetchBoxAddAndPush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '发货成功',
      });
      callback();
    },
    // get 盲盒中奖记录 - 签到游戏/免费领商品(电商品) - 列表
    *fetchListUserPackageManagement({ payload }, { call, put }) {
      const response = yield call(fetchListUserPackageManagement, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          gameSignList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    // get 盲盒中奖记录 - 签到游戏/免费领商品(卡豆权益品) - 列表
    *fetchListUserPackageManagementBean({ payload }, { call, put }) {
      const response = yield call(fetchListUserPackageManagementBean, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          gameEquityList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    // get 盲盒中奖记录 - 签到游戏/免费领商品(电商品) - 列表导出
    *fetchGetGameExcel({ payload, callback }, { call }) {
      const response = yield call(fetchListUserPackageManagementExport, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content.userPackageDTOList);
    },
    // get 盲盒中奖记录 - 签到游戏/免费领商品(卡豆权益品) - 列表导出
    *fetchListUserPackageManagementBeanExport({ payload, callback }, { call }) {
      const response = yield call(fetchListUserPackageManagementBeanExport, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content.gameRecordDTOList);
    },
    // post 盲盒中奖记录 - 免费领商品 - 查看物流
    *fetchGetUserPackageByIdDetail({ payload, callback }, { call }) {
      const response = yield call(fetchGetUserPackageById, payload);
      if (!response) return;
      const { content } = response;
      const { logisticsInfo = '', ...other } = content?.userPackage;
      const data = {
        ...other,
        logisticsCompany: logisticsInfo?.split('|')[0],
        logisticsNum: logisticsInfo?.split('|')[1],
      };
      callback && callback(data);
    },
    // post 盲盒中奖记录 - 免费领商品 - 发货
    *fetchDeliveryUserPackage({ payload, callback }, { call }) {
      const response = yield call(fetchDeliveryUserPackage, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '发货成功',
      });
      callback();
    },
  },
};
