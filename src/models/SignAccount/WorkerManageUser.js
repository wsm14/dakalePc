import moment from 'moment';
import { notification } from 'antd';
import {
  fetchWMSUserList,
  fetchWMSUserRoles,
  fetchWMSUserDetail,
  fetchWMSUserAdd,
  fetchWMSUserEdit,
  fetchUserListByCompany,
  fetchUserEditByCompany,
  fetchUserDetailsByCompany,
  fetchUserAddByCompany,
  fetchUserAddByPartner,
  fetchUserEditByPartner,
  fetchUserListByPartner,
  fetchUserDetailsByPartner
} from '@/services/SignAccountServices';

export default {
  namespace: 'workerManageUser',

  state: {
    list: [],
    total: 0,
    companyList: {
      total: 0,
      list: []
    },
    rolesList: [],
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state) {
      return {
        ...state,
        userInfo: {},
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchWMSUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchWMSUserRoles({ payload }, { call, put }) {
      const response = yield call(fetchWMSUserRoles, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          rolesList: content.recordList.map((item) => ({
            key: item.idString,
            title: item.roleName,
            description: item.roleName,
          })),
        },
      });
    },
    *fetchWMSUserDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchWMSUserDetail, payload);
      if (!response) return;
      const { content } = response;
      const { entryDate, departmentId } = content.authAdminDetail;
      callback({
        ...content.authAdminDetail,
        entryDate: moment(entryDate),
        departmentId: [departmentId],
      });
    },
    *fetchWMSUserAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWMSUserAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户新增成功',
      });
      callback();
    },
    *fetchUserAddByCompany({ payload, callback }, { call }) {
      const response = yield call(fetchUserAddByCompany, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户新增成功',
      });
      callback();
    },
    *fetchWMSUserEdit({ payload, callback }, { call }) {
      const response = yield call(fetchWMSUserEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户修改成功',
      });
      callback();
    },
    *fetchUserEditByCompany({ payload, callback }, { call }) {
      const response = yield call( fetchUserEditByCompany, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户修改成功',
      });
      callback();
    },
    *fetchUserListByCompany({ payload, callback }, { call, put }) {
      const response = yield call(fetchUserListByCompany, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          companyList: {
            total: content.total,
            list: content.recordList
          },
        },
      });
    },
    *fetchUserDetailsByCompany({ payload, callback }, { call, put }) {
      const response = yield call(fetchUserDetailsByCompany, payload);
      if (!response) return;
      const { content } = response;
      callback({
        ...content.authCompanyDetail,
      });
    },
    *fetchUserEditByPartner({ payload, callback }, { call }) {
      const response = yield call(fetchUserEditByPartner, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户修改成功',
      });
      callback();
    },
    *fetchUserListByPartner({ payload, callback }, { call, put }) {
      const response = yield call(fetchUserListByPartner, payload);
      if (!response) return;
      const { content } = response;
      console.log(content)
      yield put({
        type: 'save',
        payload: {
          partnerList: {
            total: content.total,
            list: content.recordList
          },
        },
      });
    },
    *fetchUserDetailsByPartner({ payload, callback }, { call, put }) {
      const response = yield call(fetchUserDetailsByPartner, payload);
      if (!response) return;
      const { content } = response;
      callback({
        ...content.partnerDetail,
        districtName:[]
      });
    },
    *fetchUserAddByPartner({ payload, callback }, { call }) {
      const response = yield call(fetchUserAddByPartner, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户新增成功',
      });
      callback();
    },
  },
};
