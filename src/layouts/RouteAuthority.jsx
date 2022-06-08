import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import pathRegexp from 'path-to-regexp';
import { Result, Button } from 'antd';
import { history, Link, connect } from 'umi';

const getRouteAuthority = (path, routeData) => {
  let authorities = false;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.path === path) {
        authorities = true;
        return;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser, authority } = this.props;

    // token 判断
    const isLogin = sessionStorage.getItem('token') && currentUser && currentUser.username;

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!getRouteAuthority(authority.path, authority.routes)) {
      return (
        <Result
          status="404"
          title="404"
          extra={
            <Button type="primary" onClick={() => history.push(authority.routes[0].path)}>
              返回首页
            </Button>
          }
        />
      );
    }

    if (!isLogin && window.location.pathname !== '/login/index') {
      return (
        <Result
          status={403}
          subTitle="登录信息失效，请重新登录"
          extra={
            <Button type="primary">
              <Link to="/login/index">去登陆</Link>
            </Button>
          }
        />
      );
    }
    return children;
  }
}

export default connect(({ userInfo, loading }) => ({
  currentUser: userInfo.currentUser,
  loading: loading.models.userInfo,
}))(SecurityLayout);
