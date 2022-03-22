import { fetchUserAnalysisReport, fetchUserStatisticReport } from '@/services/ChartServices';
import { USER_ANALYSIS_TYPE, PAY_USER_TYPE } from '@/common/constant';
export default {
  namespace: 'userDataStat',

  state: {
    newRegisterDataObj: {},
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
    *fetchUserAnalysisReport({ payload }, { call, put }) {
      const { reportType = 'newRegister' } = payload;
      const response = yield call(fetchUserAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { analysisList = [], ...other } = content;

      let newArr = [];
      if (reportType === 'newRegister') {
        analysisList.forEach((item) => {
          const { statisticDay, statisticMonth, totalUnknownNum, ...other } = item;
          Object.keys(other).forEach((cell) =>
            newArr.push({
              statisticDay: statisticDay || statisticMonth,
              value: other[cell],
              type: USER_ANALYSIS_TYPE[cell],
            }),
          );
        });
      } else if (reportType === 'payUser') {
        analysisList.forEach((item) => {
          const {
            statisticDay,
            statisticMonth,
            totalUnknownNum,
            totalAppNum,
            totalCommunityNum,
            totalMarkNum,
            totalWeChatNum,
            ...other
          } = item;
          Object.keys(other).forEach((cell) =>
            newArr.push({
              statisticDay: statisticDay || statisticMonth,
              value: other[cell],
              type: PAY_USER_TYPE[cell],
            }),
          );
        });
      } else {
        analysisList.forEach((item) => {
          const { statisticDay, statisticMonth, totalWatchVideoNum } = item;
          newArr.push({
            statisticDay: statisticDay || statisticMonth,
            value: totalWatchVideoNum,
            type: '看视频用户数',
          });
        });
      }

      yield put({
        type: 'save',
        payload: {
          newRegisterDataObj: { dataList: newArr, ...other },
        },
      });
    },
    *fetchUserStatisticReportGender({ payload }, { call, put }) {
      const response = yield call(fetchUserStatisticReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserGenderList = [], ...other } = content;

      console.log(reportUserGenderList);

      yield put({
        type: 'save',
        payload: {},
      });
    },
    *fetchUserStatisticReportAge({ payload }, { call, put }) {
      const response = yield call(fetchUserStatisticReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserGenderList = [], ...other } = content;

      console.log(reportUserGenderList, 2);

      yield put({
        type: 'save',
        payload: {},
      });
    },
  },
};
