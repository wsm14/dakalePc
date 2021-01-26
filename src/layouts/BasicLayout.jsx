/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useEffect } from 'react';
import ProLayout from '@ant-design/pro-layout';
import { Affix, BackTop } from 'antd';
import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import RouteAuthority from './RouteAuthority';
import RightContent from '@/components/GlobalHeader/RightContent';
import HeaderContent from '@/components/GlobalHeader/HeaderContent';
import DrawerModalForm from '@/components/DrawerModalForm';
import iconEnum from '@/common/iconEnum';
import logo from '../../public/favicon.png';
import { AliveScope } from 'react-activation';

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    pageTitle,
    pageBtn,
    menuList,
    loading,
  } = props;

  // 本地菜单
  // const menuDataRender = (menuList, keys = true) => {
  //   return menuList.map((item) => {
  //     if (keys) rootSubmenuKeys.push(item.path);
  //     const localItem = {
  //       ...item,
  //       children: item.children ? menuDataRender(item.children, false) : undefined,
  //     };
  //     return localItem;
  //   });
  // };
  // 动态菜单
  const menuDataRender = (menu, keys = true) => {
    return menu.map((item) => {
      const {
        accessName: name,
        accessIcon: icon,
        accessUrl: path,
        childList: routes,
        buttons = null,
      } = item;
      const localItem = {
        name,
        icon: iconEnum[icon],
        path,
        buttons,
        routes: routes ? menuDataRender(routes, false) : undefined,
      };
      return localItem;
    });
  };

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'userInfo/fetchCurrent',
      });
      dispatch({
        type: 'userInfo/fetchGetAuthMenuTree',
      });
    }
  }, []);

  /**
   * init variables
   */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const handleCloseTitle = () => {
    dispatch({
      type: 'global/closeTitle',
    });
  };

  return (
    <AliveScope>
      <ProLayout
        onPageChange={handleCloseTitle}
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        itemRender={(route, params, routes, paths) => {
          return false;
        }}
        menuDataRender={() => menuDataRender(menuList)}
        menu={{ loading }}
        headerRender={() => <HeaderContent />}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <RouteAuthority authority={{ path: location.pathname, routes: props.route.routes }}>
          <RouteContext.Consumer>
            {(value) => {
              const { breadcrumb } = value;
              return (
                <PageContainer
                  subTitle={
                    breadcrumb.routes &&
                    `${breadcrumb.routes.map((item) => item.breadcrumbName).join(' / ')}
                  ${pageTitle.length > 0 ? ' / ' : ''}
                  ${pageTitle.join(' / ')}`
                  }
                  title={false}
                  extra={pageBtn.length ? <Affix offsetTop={60}>{pageBtn}</Affix> : ''}
                >
                  {children}
                </PageContainer>
              );
            }}
          </RouteContext.Consumer>
        </RouteAuthority>
        <BackTop />
        <DrawerModalForm></DrawerModalForm>
      </ProLayout>
    </AliveScope>
  );
};

export default connect(({ global, settings, userInfo }) => ({
  collapsed: global.collapsed,
  menuList: userInfo.menuList,
  loading: userInfo.loading,
  pageTitle: global.pageTitle,
  pageBtn: global.pageBtn,
  settings,
}))(BasicLayout);
