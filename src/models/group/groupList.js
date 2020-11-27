import {notification} from 'antd';
import {
  fetchMerchantGroup,
  fetchAddMerchantGroup,
  fetchGetOcrBankLicense,
  fetchGetOcrIdCardFront,
  fetchGetOcrIdCardBack,
  fetchGetOcrBusinessLicense,
  fetchMerchantBank,
  fetchWMSUserRoles
} from '@/services/groupServices';

export default {
  namespace: 'groupSet',
  state: {
    list: {list: [], total: 0},
    visible: false,
    visible1: false,
    rolesList: []
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    clearDetail(state, {payload}) {
      return {
        ...state,
        ...payload,
        detailList: {list: [], total: 0},
      };
    },
  },

  effects: {
    *fetchGetList({payload}, {call, put}) {
      const response = yield call(fetchMerchantGroup, payload);
      if (!response) return;
      const {content} = response;
      console.log(content)
      yield put({
        type: 'save',
        payload: {
          list: {list: content.recordList || []},
        },
      });
    },
    *fetchWMSUserRoles({payload}, {call, put}) {
      const response = yield call(fetchWMSUserRoles, payload);
      if (!response) return;
      const {content} = response;
      yield put({
        type: 'save',
        payload: {
          rolesList: content.recordList.map(item => ({
            key: item.idString,
            title: item.roleName,
            description: item.roleName,
          }))
        },
      });
    },
    *fetchAddList({payload, callback}, {call, put}) {
      const response = yield call(fetchAddMerchantGroup, payload);
      if (!response) return;
      const {merchantGroupId} = response
      yield put({
        type:'save',
        payload: {
          merchantGroupId
        }
      })
      notification.success({
        message: '添加成功',
        duration: 1500
      })
      callback && callback()
    },
    *fetchGetOcrBusinessLicense({payload, callback}, {call, put}) {
      const response = yield call(fetchGetOcrBusinessLicense, payload);
      if (!response) return;
      const {content} = response;
      callback && callback(content)
    },
    *fetchGetOcrBankLicense({payload, callback}, {call, put}) {
      const response = yield call(fetchGetOcrBankLicense, payload);
      if (!response) return;
      const {content} = response;
      callback && callback(content)
    },

    *fetchGetOcrIdCardFront({payload, callback}, {call, put}) {
      const response = yield call(fetchGetOcrIdCardFront, payload);
      if (!response) return;
      const {content} = response;
      callback && callback(content)
    },

    *fetchGetOcrIdCardBack({payload, callback}, {call, put}) {
      const response = yield call(fetchGetOcrIdCardBack, payload);
      if (!response) return;
      const {content} = response;
      callback && callback(content)
    },

    *fetchMerchantBank({payload, callback}, {call, put}) {
      const response = yield call(fetchMerchantBank, payload);
      if (!response) return;
      notification.success({
        message: '添加成功',
        duration: 1500
      })
      const {content} = response;
      callback && callback(content)
    },
  },
};
