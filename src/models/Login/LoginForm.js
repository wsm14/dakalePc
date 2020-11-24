import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin } from '@/services/LoginServices';
import { getPageQuery } from '@/utils/utils';

const LoginForm = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (!response) return;

      const {
        content: { authAdmin },
      } = response;
      window.sessionStorage.setItem('token', authAdmin.token);
      callback();
    },

    logout() {
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/login/index' && !redirect) {
        history.replace({
          pathname: '/login/index',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: 'ok', type: payload.type };
    },
  },
};
export default LoginForm;
