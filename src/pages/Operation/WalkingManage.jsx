import React from 'react';
import VaneManage from './components/Walking/Vane';
import NavigationManage from './components/Walking/Navigation';
import GratiaClassManage from './components/Walking/GratiaClass';

const WalkingManage = () => {
  const style = { marginTop: 20 };
  return (
    <>
      {/* 风向标配置 */}
      <VaneManage></VaneManage>
      {/* 导航类目页面配置 */}
      <NavigationManage style={style}></NavigationManage>
      {/* 特惠商品类目配置 */}
      <GratiaClassManage style={{ ...style, marginBottom: 50 }}></GratiaClassManage>
    </>
  );
};

export default WalkingManage;
