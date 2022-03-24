import React, { useState, useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import styles from './index.less';
import InviteImg from './components/GlobalConfig/InviteImg';
import HolidayConfig from './components/GlobalConfig/HolidayConfig';
import RechargeShare from './components/GlobalConfig/RechargeShare';
import UgcLabel from './components/GlobalConfig/UgcLabel';
import TabConfigure from './components/GlobalConfig/TabConfigure';
import VirtualRatioConfig from './components/GlobalConfig/VirtualRatioConfig';
import BottomIconConfig from './components/GlobalConfig/BottomIconConfig';
import SearchSetList from './components/GlobalConfig/SearchSetList'
import VideoConfig from './components/GlobalConfig/VideoConfig'

const GlobalConfig = (props) => {
  let main = undefined;

  const [mode, setMode] = useState('inline'); // 菜单显示状态
  const [menuKey, setMenuKey] = useState('videoConfig'); // menu key 

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
      type: 'videoConfig',
      menuName: '刷视频规则配置',
      block: <VideoConfig></VideoConfig>,
    },
   
    {
      type: 'holidayConfig',
      menuName: '节日配置',
      block: <HolidayConfig></HolidayConfig>,
    },
    {
      type: 'inviteImg',
      menuName: '邀请好友图片',
      block: <InviteImg></InviteImg>,
    },
    {
      type: 'rechargeShare',
      menuName: '充值分享海报配置',
      block: <RechargeShare></RechargeShare>,
    },
    {
      type: 'ugcLabel',
      menuName: 'UGC视频标签配置',
      block: <UgcLabel></UgcLabel>,
    },
    {
      type: 'tabConfigure',
      menuName: '首页tab配置',
      block: <TabConfigure></TabConfigure>,
    },
    {
      type: 'virtualRatioConfig',
      menuName: '卡豆抵扣比例配置',
      block: <VirtualRatioConfig></VirtualRatioConfig>,
    },
    {
      type: 'bottomIconConfig',
      menuName: '底部中心icon配置',
      block: <BottomIconConfig></BottomIconConfig>,
    },
    {
      type: 'searchConfig',
      menuName: '搜索配置',
      block: <SearchSetList></SearchSetList>,
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
export default GlobalConfig;
