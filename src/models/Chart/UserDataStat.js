import {
  fetchUserAnalysisReport,
  fetchUserStatisticReport,
  fetchUserPortraitAreaReport,
  fetchUserAccumulativeReport,
  fetchUserChannelStatisticsReport,
  fetchUserChannelContrastReport,
} from '@/services/ChartServices';
import { USER_ANALYSIS_TYPE, PAY_USER_TYPE } from '@/common/constant';

const totalNum = (list, key) => {
  return list.reduce((preValue, curValue) => preValue + curValue[key], 0);
};

export default {
  namespace: 'userDataStat',

  state: {
    newRegisterDataObj: {},
    genderList: [],
    ageList: [],
    provinceList: [],
    cityList: [],
    districtList: [],
    addUpData: {},
    channelList: { list: [], total: 0 },
    channelListOne: [],
    channelListTwo: [],
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
      const { reportUserGenderList = [] } = content;

      const genderList = reportUserGenderList.map((item) => ({
        ...item,
        gender: {
          M: '男',
          F: '女',
        }[item.gender],
        percentage: `${(
          (item.totalGenderUserNum / totalNum(reportUserGenderList, 'totalGenderUserNum')) *
          100
        ).toFixed(2)}%`,
      }));

      yield put({
        type: 'save',
        payload: {
          genderList,
        },
      });
    },
    *fetchUserStatisticReportAge({ payload }, { call, put }) {
      const response = yield call(fetchUserStatisticReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserAgeList = [] } = content;

      const addNum = totalNum(reportUserAgeList, 'totalAgeUserNum');

      const ageList = reportUserAgeList.map((item) => ({
        ...item,
        ageRange:
          item.ageRange === '0-17'
            ? '17岁以下'
            : item.ageRange === '50-120'
            ? '50岁以上'
            : `${item.ageRange}岁`,
        percentage: `${((item.totalAgeUserNum / addNum) * 100).toFixed(2)}%`,
      }));

      yield put({
        type: 'save',
        payload: {
          ageList: ageList.sort((a, b) => b.totalAgeUserNum - a.totalAgeUserNum),
        },
      });
    },

    *fetchUserPortraitAreaReportProvince({ payload }, { call, put }) {
      const response = yield call(fetchUserPortraitAreaReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserPortraitAreaList = [] } = content;

      const provinceList = reportUserPortraitAreaList.map((item) => ({
        ...item,
        provinceCode: `${item.provinceCode}0000`,
        percentage: `${(
          (item.totalAreaNum / totalNum(reportUserPortraitAreaList, 'totalAreaNum')) *
          100
        ).toFixed(2)}%`,
      }));

      yield put({
        type: 'save',
        payload: {
          provinceList,
        },
      });
    },
    *fetchUserPortraitAreaReportCity({ payload }, { call, put }) {
      const response = yield call(fetchUserPortraitAreaReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserPortraitAreaList = [] } = content;

      const cityList = reportUserPortraitAreaList.map((item) => ({
        ...item,
        cityCode: `${item.cityCode}00`,
        percentage: `${(
          (item.totalAreaNum / totalNum(reportUserPortraitAreaList, 'totalAreaNum')) *
          100
        ).toFixed(2)}%`,
      }));

      yield put({
        type: 'save',
        payload: {
          cityList,
        },
      });
    },
    *fetchUserPortraitAreaReportDistrict({ payload }, { call, put }) {
      const response = yield call(fetchUserPortraitAreaReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserPortraitAreaList = [] } = content;

      const districtList = reportUserPortraitAreaList.map((item) => ({
        ...item,
        percentage: `${(
          (item.totalAreaNum / totalNum(reportUserPortraitAreaList, 'totalAreaNum')) *
          100
        ).toFixed(2)}%`,
      }));

      yield put({
        type: 'save',
        payload: {
          districtList,
        },
      });
    },
    *fetchUserAccumulativeReport({ payload }, { call, put }) {
      const response = yield call(fetchUserAccumulativeReport, payload);
      if (!response) return;
      const { content = {} } = response;

      yield put({
        type: 'save',
        payload: {
          addUpData: content,
        },
      });
    },
    *fetchUserChannelStatisticsReport({ payload }, { call, put }) {
      const response = yield call(fetchUserChannelStatisticsReport, payload);
      if (!response) return;
      const { content = {} } = response;

      yield put({
        type: 'save',
        payload: {
          channelList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchUserChannelContrastReportOne({ payload }, { call, put }) {
      const response = yield call(fetchUserChannelContrastReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserChannelList = [] } = content;

      let channelListOne = reportUserChannelList.map((item) => {
        const { statisticDay, statisticMonth, ...other } = item;
        return {
          ...other,
          statisticDay: statisticDay || statisticMonth,
          type: '渠道一',
        };
      });

      yield put({
        type: 'save',
        payload: {
          channelListOne,
        },
      });
    },
    *fetchUserChannelContrastReportTwo({ payload }, { call, put }) {
      const response = yield call(fetchUserChannelContrastReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { reportUserChannelList = [] } = content;

      let channelListTwo = reportUserChannelList.map((item) => {
        const { statisticDay, statisticMonth, ...other } = item;
        return {
          ...other,
          statisticDay: statisticDay || statisticMonth,
          type: '渠道二',
        };
      });

      yield put({
        type: 'save',
        payload: {
          channelListTwo,
        },
      });
    },
  },
};
