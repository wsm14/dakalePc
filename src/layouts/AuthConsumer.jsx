import { connect, useLocation, useSelector } from 'umi';

// 检查权限返回对应数据 目前传进数组 auth 字段判断
export const authCheck = (checkAuth = []) => {
  const flag = useSelector((state) => state.userInfo.flag);
  const menuBtn = useSelector((state) => state.userInfo.menuBtn);
  if (flag === 1) return checkAuth;
  const authMenu = menuBtn[useLocation().pathname];
  return authMenu
    ? checkAuth.filter((item) => authMenu.includes(item.auth) || item.auth === true)
    : null;
};

/**
 * 权限检查组件
 * @param {*} auth 权限key校验 flag 为1全部权限默认显示，auth值为true则默认显示，否则走权限校验存在则显示
 * @param {*} noAuth 无权限时显示内容
 * @param {*} show 是否显示组件
 * @param {*} menuBtn 按钮数据 model userInfo层获取
 * @param {*} children
 */
const AuthConsumer = (props) => {
  const { menuBtn, children, auth = false, noAuth = null, flag, show = true } = props;
  if (!show) return '';
  // 判断是否直接显示 不走权限校验
  if (auth === true || flag === 1) return children;
  // 获取当前路由下按钮权限
  const authMenu = menuBtn[useLocation().pathname];
  // 权限校验权限是否存在
  const checkAuth = authMenu ? authMenu.includes(auth) : false;
  // auth 默认不显示子组件
  // auth true 显示子组件
  // 权限不存在时，可显示 noAuth 内容
  return checkAuth ? children : noAuth;
};

export default connect(({ userInfo }) => ({
  flag: userInfo.flag,
  menuBtn: userInfo.menuBtn,
}))(AuthConsumer);
