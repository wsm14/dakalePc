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
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (!response) return;

      const {
        content: { adminInfo },
      } = response;

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        }
      }
      history.replace(redirect || '/user');
      window.sessionStorage.setItem('token', adminInfo.token);
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
