/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useEffect, useState } from 'react';
import ProLayout from '@ant-design/pro-layout';
import { Affix, BackTop, Input, ConfigProvider } from 'antd';
import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import zhCN from 'antd/lib/locale/zh_CN';
import RouteAuthority from './RouteAuthority';
import RightContent from '@/components/GlobalHeader/RightContent';
import HeaderContent from '@/components/GlobalHeader/HeaderContent';
import iconEnum from '@/common/iconEnum';
import logo from '../../public/favicon.png';
import { LogDetail } from '@/components/PublicComponents';

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
  const [keyWord, setKeyWord] = useState('');
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

  const filterByMenuDate = (data, keyWord) => {
    return data
      .map((item) => {
        if (
          (item.name && item.name.includes(keyWord)) ||
          filterByMenuDate(item.routes || [], keyWord)?.length > 0
        ) {
          return {
            ...item,
            path: item.path.split('/').length - 1 > 1 ? item.path : null,
            routes: filterByMenuDate(item.routes || [], keyWord),
          };
        }
        return undefined;
      })
      .filter((item) => item);
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

  const handleAddMenuOpen = (menuItem) => {
    dispatch({
      type: 'userInfo/saveOpenMenu',
      payload: {
        menuItem: {
          path: menuItem.path,
          name: menuItem.name,
          key: menuItem.key,
        },
      },
    });
  };

  return (
    <ConfigProvider locale={zhCN}>
      <ProLayout
        onPageChange={handleCloseTitle}
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuExtraRender={({ collapsed }) =>
          !collapsed && (
            <Input.Search
              onSearch={(e) => {
                setKeyWord(e);
              }}
            />
          )
        }
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom;
          }
          return (
            <Link to={menuItemProps.path} onClick={() => handleAddMenuOpen(menuItemProps)}>
              {defaultDom}
            </Link>
          );
        }}
        itemRender={(route, params, routes, paths) => {
          return false;
        }}
        menuDataRender={() => menuDataRender(menuList)}
        menu={{ loading }}
        headerRender={() => <HeaderContent />}
        postMenuData={(menus) => filterByMenuDate(menus, keyWord)}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <RouteAuthority authority={{ path: location.pathname, routes: props.route.routes }}>
          <RouteContext.Consumer>
            {(value) => {
              const { pageTitleInfo } = value;
              if (pageTitleInfo.id) {
                return (
                  <PageContainer
                    subTitle={
                      pageTitleInfo.id &&
                      `${pageTitleInfo.id.split('.').slice(1, 3).join(' / ')}${
                        pageTitle.length > 0 ? ' / ' : ''
                      }
                       ${pageTitle.join(' / ')}`
                    }
                    title={false}
                    extra={pageBtn.length ? <Affix offsetTop={60}>{pageBtn}</Affix> : ''}
                  >
                    {children}
                  </PageContainer>
                );
              } else {
                return children;
              }
            }}
          </RouteContext.Consumer>
        </RouteAuthority>
        <BackTop visibilityHeight={100} style={{ right: 25 }} />
        {/* 日志 */}
        <LogDetail></LogDetail>
      </ProLayout>
    </ConfigProvider>
  );
};

export default connect(({ global, settings, userInfo, loading }) => ({
  collapsed: global.collapsed,
  menuList: userInfo.menuList,
  loading: userInfo.loading || loading.effects['userInfo/fetchGetAuthMenuTree'],
  pageTitle: global.pageTitle,
  pageBtn: global.pageBtn,
  settings,
}))(BasicLayout);
