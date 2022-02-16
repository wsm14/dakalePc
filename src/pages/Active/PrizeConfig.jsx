import React, { useState, useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import Jackpot from './components/PrizeConfig/Jackpot';
import RuleManage from './components/PrizeConfig/Rule';
import NoobJackPot from './components/PrizeConfig/NoobJackPot';
import styles from './index.less';

const PrizeConfig = () => {
  let main = undefined;

  const [mode, setMode] = useState('inline'); // 菜单显示状态
  const [menuKey, setMenuKey] = useState('jackpot'); // menu key

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

export default PrizeConfig;
