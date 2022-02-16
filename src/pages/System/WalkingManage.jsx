import React, { useState, useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import HotCityPage from './components/Walking/HotCityPage';
import VaneManage from './components/Walking/Vane';
import NavigationManage from './components/Walking/Navigation';
import GratiaClassManage from './components/Walking/GratiaClass';
import GatherPage from './components/Walking/GatherPage';
import StrollAround from './components/Walking/StrollAround';
import SelfTour from './components/Walking/SelfTour';
import styles from './index.less';

const WalkingManage = () => {
  let main = undefined;

  const [mode, setMode] = useState('inline'); // 菜单显示状态
  const [menuKey, setMenuKey] = useState('strollAround'); // menu key

  useEffect(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', resize);
    resize();
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // 监听窗口大小变化
  const resize = () => {
    if (!main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!main) {
        return;
      }
      let mode = 'inline';
      const { offsetWidth } = main;
      if (main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setMode(mode);
    });
  };

  const menuList = [
    {
      type: 'strollAround',
      menuName: '逛逛页面配置',
      block: <StrollAround></StrollAround>,
    },
    {
      type: 'vaneManage',
      menuName: '风向标配置',
      block: <VaneManage></VaneManage>,
    },
    {
      type: 'navigationManage',
      menuName: '导航类目页面配置',
      block: <NavigationManage></NavigationManage>,
    },
    {
      type: 'gratiaClassManage',
      menuName: '特惠商品类目配置',
      block: <GratiaClassManage></GratiaClassManage>,
    },
    {
      type: 'gatherPage',
      menuName: '集合页配置',
      block: <GatherPage></GatherPage>,
    },
    {
      type: 'hotCityPage',
      menuName: '热门城市配置',
      block: <HotCityPage></HotCityPage>,
    },
    {
      type: 'selfTour',
      menuName: '自我游',
      block: <SelfTour></SelfTour>,
    },
  ];

  // 显示内容判断
  const renderChildren = () => menuList.filter((item) => item.type === menuKey)[0].block;

  return (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) main = ref;
        }}
      >
        <div className={styles.leftMenu}>
          {/* 左边菜单遍历 */}
          <Menu mode={mode} selectedKeys={[menuKey]} onClick={({ key }) => setMenuKey(key)}>
            {menuList.map((item) => (
              <Menu.Item key={item.type}>{item.menuName}</Menu.Item>
            ))}
          </Menu>
        </div>
        <div className={styles.right}>
          {/* 右边内容显示 */}
          {renderChildren()}
        </div>
      </div>
    </GridContent>
  );
};

export default WalkingManage;
