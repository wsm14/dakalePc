/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, Modal } from 'antd';
import { encrypt } from './utils';
import { history } from 'umi';

notification.config({
  duration: 3,
  placement: 'topRight',
});

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
  '2001': '管理员账号不存在',
  '5005': '用户身份失效请重新登录',
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status !== 200) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
    return false;
  } else if (!response) {
    notification.error({
      description: '无法连接服务器',
      message: '网络异常',
    });
    return false;
  }
  return response;
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'same-origin', // 默认请求是否带上cookie 'include','same-origin'
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  let { data = {}, params = {} } = options;
  // if (method === 'get') data = encrypt(data);
  params = encrypt(params);
  options = { ...options, data, params };

  const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
    appType: 'admin',
  };

  return {
    url: `${APIURL}${url}`,
    options: { ...options, headers },
  };
});

// response拦截器, 处理response
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  const { success, resultCode = '', resultDesc = '' } = data;
  if (resultCode === '5005' || resultCode === '2001') {
    Modal.warning({
      title: resultDesc,
      okText: '去登录',
      onOk: () => {
        Modal.destroyAll();
        history.push('/login/index');
      },
    });
    return false;
  }
  if (!success && response.status == 200) {
    notification.info({
      message: '提示',
      description: resultDesc || errorHandler(response),
    });
    return false;
  }
  return response;
});

export default request;
