import { connect, useLocation } from 'umi';

const AuthConsumer = (props) => {
  const { menuBtn, children, auth = false } = props;
  const authMenu = menuBtn[useLocation().pathname];
  const checkAuth = authMenu ? authMenu.includes(auth) : false;
  // auth 默认没有不显示子组件
  // auth true 默认显示子组件
  // auth 存在时 判断菜单权限内是否包含此权限 包含显示 否则不显示
  return auth === true ? children : checkAuth ? children : null;
};

export default connect(({ userInfo }) => ({
  menuBtn: userInfo.menuBtn,
}))(AuthConsumer);
