import { connect, useLocation, useSelector } from 'umi';

// 检查权限返回对应数据 目前传进数组 auth 字段判断
export const authCheck = (checkAuth = []) => {
  const flag = useSelector((state) => state.userInfo.flag);
  const menuBtn = useSelector((state) => state.userInfo.menuBtn);
  if (flag === 1) return checkAuth;
  const authMenu = menuBtn[useLocation().pathname];
  return checkAuth.filter((item) => authMenu.includes(item.auth) || item.auth === true);
};

const AuthConsumer = (props) => {
  const { menuBtn, children, auth = false, noAuth = null, flag } = props;
  if (auth === true || flag === 1) return children;
  const authMenu = menuBtn[useLocation().pathname];
  const checkAuth = authMenu ? authMenu.includes(auth) : false;
  // auth 默认没有不显示子组件
  // auth true 默认显示子组件
  // auth 存在时 判断菜单权限内是否包含此权限 包含显示 否则不显示
  return checkAuth ? children : noAuth;
};

export default connect(({ userInfo }) => ({
  flag: userInfo.flag,
  menuBtn: userInfo.menuBtn,
}))(AuthConsumer);
