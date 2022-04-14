import React, { useState, useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import GlobalModal from './components/Configure/GlobalModal';
import FloatModal from './components/Configure/FloatModal';
import NewWelfareModal from './components/Configure/NewWelfareModal';
import WeeksCard from './components/Configure/WeeksCard';
import Jackpot from './components/PrizeConfig/Jackpot';
import RuleManage from './components/PrizeConfig/Rule';
import NoobJackPot from './components/PrizeConfig/NoobJackPot';
import AppSetTabList from './components/App/AppSetTabList';
import MaterialConfig from './components/MaterialConfig/MaterialConfig';
import GroupGoodsConfig from './components/GroupGoodsConfig'

import styles from './styles.less';

const MarkConfigure = () => {
  let main = undefined;

  const [mode, setMode] = useState('inline'); // 菜单显示状态
  const [menuKey, setMenuKey] = useState('globalModal'); // menu key

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
      type: 'globalModal',
      menuName: '全局弹窗配置',
      block: <GlobalModal></GlobalModal>,
    },
    {
      type: 'appSetTabList',
      menuName: 'banner配置',
      block: <AppSetTabList></AppSetTabList>,
    },

    {
      type: 'floatModal',
      menuName: '浮窗配置',
      block: <FloatModal></FloatModal>,
    },
    {
      type: 'newWelfareModal',
      menuName: '新人福利弹窗',
      block: <NewWelfareModal></NewWelfareModal>,
    },
    {
      type: 'weeksCard',
      menuName: '周卡配置',
      block: <WeeksCard></WeeksCard>,
    },
    {
      type: 'materialConfig',
      menuName: '营销物料配置',
      block: <MaterialConfig></MaterialConfig>,
    },
    {
      type: 'jackpot',
      menuName: '盲盒奖池配置',
      block: <Jackpot></Jackpot>,
    },
    {
      type: 'rule',
      menuName: 'APP盲盒规则配置',
      block: <RuleManage></RuleManage>,
    },
    {
      type: 'noob',
      menuName: '新手必中奖池',
      block: <NoobJackPot></NoobJackPot>,
    },
    {
      type: 'groupGoodsConfig',
      menuName: '拼团商品配置',
      block: <GroupGoodsConfig></GroupGoodsConfig>,
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

export default MarkConfigure;
