import { fetchMomentKanBan } from '@/services/ChartServices';

export default {
  namespace: 'videoBoard',

  state: {
    videoObject: {},
    PGCData: [],
    UGCData: [],
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
    *fetchMomentKanBan({ payload }, { call, put }) {
      const response = yield call(fetchMomentKanBan, payload);
      if (!response) return;
      const { content } = response;
      const { momentStatistic = {} } = content;
      const { momentMap = {} } = momentStatistic;
      const { ugcMap = {} } = momentMap;
      const PGCData = [
        {
          type: '探店视频',
          count: momentMap?.probeShopMomentCount || 0,
        },
        {
          type: '带货视频',
          count: momentMap?.commerceMomentCount || 0,
        },
      ];
      const UGCArr = Object.keys(ugcMap);
      const UGCData = UGCArr.map((item) => {
        return {
          type: item,
          count: ugcMap[item],
        };
      });

      yield put({
        type: 'save',
        payload: {
          videoObject: content,
          PGCData,
          UGCData,
        },
      });
    },
  },
};
