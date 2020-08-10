/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useEffect, useState } from 'react';
import ProLayout from '@ant-design/pro-layout';
import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import RouteAuthority from './RouteAuthority';
import { Button } from 'antd';
import RightContent from '@/components/GlobalHeader/RightContent';
import DrawerModalForm from '@/components/DrawerModalForm';
import iconEnum from '@/common/iconEnum';
import logo from '../../public/favicon.png';

/**
 * use Authorized check all menu item
 */

// const menuDataRender = (menuList) =>
//   menuList.map((item) => {
//     const {
//       accessName: name,
//       accessIcon: icon,
//       accessUrl: path,
//       subAuthAccessDTOList: routes,
//     } = item;
//     const localItem = {
//       name,
//       icon: iconEnum[icon],
//       path,
//       routes: routes ? menuDataRender(routes) : undefined,
//     };
//     return localItem;
//   });

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    menuList,
  } = props;

  const [rootSubmenuKeys] = useState([]); // 菜单一级keys
  const [openKeys, setOpenKeys] = useState([]); // 菜单展开的keys
  const [title, setTitle] = useState('');

  const menuDataRender = (menuList, keys = true) => {
    return menuList.map((item) => {
      if (keys) rootSubmenuKeys.push(item.path);
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children, false) : undefined,
      };
      return localItem;
    });
  };
  /**
   * constructor
   */

  // const [menuData, setMenuData] = useState([]);

  // useEffect(() => {
  //   // 这里是一个演示用法
  //   // 真实项目中建议使用 dva dispatch 或者 umi-request
  //   fetch('/api/example.json')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setMenuData(data || []);
  //     });
  // }, []);

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

  // 菜单展开方法
  const onOpenChange = (openKey) => {
    const latestOpenKey = openKey.find((key) => openKeys.indexOf(key) === -1);
    // setOpenKeys([latestOpenKey]);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(openKeys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <ProLayout
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      logo={logo}
      onCollapse={handleMenuCollapse}
      // onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      // breadcrumbRender={(routers = []) => [...routers]}
      itemRender={(route, params, routes, paths) => {
        // const first = routes.path === route.path;
        // setTitle(routes.map((item) => item.breadcrumbName).join(' / '));
        // return first ? (
        //   <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        // ) : (
        //   <span>{route.breadcrumbName}</span>
        // );
        return false;
      }}
      // footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <RouteAuthority authority={{ path: location.pathname, routes: props.route.routes }}>
        <RouteContext.Consumer>
          {(value) => {
            const { breadcrumb } = value;
            console.log(breadcrumb.routes);
            // 用户的标题
            return (
              <PageContainer
                subTitle={title}
                title={false}
                extra={[
                  <Button key="3">操作</Button>,
                  <Button key="2">操作</Button>,
                  <Button key="1" type="primary">
                    主操作
                  </Button>,
                ]}
              >
                {children}
              </PageContainer>
            );
          }}
        </RouteContext.Consumer>
      </RouteAuthority>
      <DrawerModalForm></DrawerModalForm>
    </ProLayout>
  );
};

export default connect(({ global, settings, userInfo }) => ({
  collapsed: global.collapsed,
  menuList: userInfo.menuList,
  settings,
}))(BasicLayout);
