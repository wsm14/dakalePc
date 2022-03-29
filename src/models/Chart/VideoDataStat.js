import {
  fetchMomentTrendAnalysisReport,
  fetchMomentNumAnalysisReport,
  fetchMomentPlayAnalysisReport,
  fetchMomentRewardAnalysisReport,
} from '@/services/ChartServices';
import {
  VIDEO_DATA_TYPE,
  PGC_VIDEO_TYPE,
  UGC_VIDEO_TYPE,
  USER_ANALYSIS_TYPE,
} from '@/common/constant';

const totalNum = (list, key) => {
  return list.reduce((preValue, curValue) => preValue + curValue[key], 0);
};

export default {
  namespace: 'videoDataStat',

  state: {
    newRegisterDataObj: {},
    UGCList: [],
    PGCList: [],
    playList: [],
    rewardList: { list: [], total: 0 },
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
    *fetchMomentTrendAnalysisReport({ payload }, { call, put }) {
      const response = yield call(fetchMomentTrendAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { analysisList = [], ...other } = content;

      let newArr = [];
      analysisList.forEach((item) => {
        const { analysisDay, analysisMonth, ...other } = item;
        Object.keys(other).forEach((cell) =>
          newArr.push({
            analysisDay: analysisDay || analysisMonth,
            value: other[cell],
            type: VIDEO_DATA_TYPE[cell],
          }),
        );
      });

      yield put({
        type: 'save',
        payload: {
          newRegisterDataObj: { dataList: newArr, ...other },
        },
      });
    },
    *fetchMomentNumAnalysisReport({ payload }, { call, put }) {
      const response = yield call(fetchMomentNumAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { UGC = {}, PGC = {} } = content;

      const UGCList = Object.keys(UGC).map((item) => ({
        value: UGC[item],
        type: UGC_VIDEO_TYPE[item],
      }));
      const PGCList = Object.keys(PGC).map((item) => ({
        value: PGC[item],
        type: PGC_VIDEO_TYPE[item],
      }));

      yield put({
        type: 'save',
        payload: {
          UGCList,
          PGCList,
        },
      });
    },
    *fetchMomentPlayAnalysisReport({ payload }, { call, put }) {
      const response = yield call(fetchMomentPlayAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { analysisList = {} } = content;
      const { subType, type, ...other } = analysisList;

      const playList = Object.keys(other).map((item) => ({
        value: other[item],
        type: `${USER_ANALYSIS_TYPE[item]} 丨${(
          (other[item] /
            (other.totalAppNum +
              other.totalCommunityNum +
              other.totalMarkNum +
              other.totalWeChatNum)) *
          100
        ).toFixed(2)}%`,
      }));

      yield put({
        type: 'save',
        payload: {
          playList,
        },
      });
    },
    *fetchMomentRewardAnalysisReport({ payload }, { call, put }) {
      const response = yield call(fetchMomentRewardAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { analysisList = [] } = content;

      let newArr = [];
      analysisList.forEach((item) => {
        const { analysisDay, analysisMonth, ...other } = item;
        Object.keys(other).forEach((cell) =>
          newArr.push({
            analysisDay: analysisDay || analysisMonth,
            value: other[cell],
            type: {
              totalBeanNum: '打赏卡豆数',
              totalPersonNum: '打赏人数',
            }[cell],
          }),
        );
      });
      const total = totalNum(analysisList, 'totalBeanNum');

      yield put({
        type: 'save',
        payload: {
          rewardList: { list: newArr, total },
        },
      });
    },
  },
};
