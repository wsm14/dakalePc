import React from 'react';
import { connect } from 'umi';
import { Button, Menu, Dropdown } from 'antd';

const SpecialRecommendMenu = (props) => {
  const { disabled, handleRecommend } = props;

  // 点击推荐
  const handleClickRecommend = (key) => {
    let value = {};
    if (key === 'cancelRecommend') {
      value = { operationFlag: key };
    } else {
      value = { recommendType: key, operationFlag: 'recommend' };
    }
    handleRecommend(value);
  };

  const menu = (
    <Menu onClick={({ key }) => handleClickRecommend(key)}>
      <Menu.Item key={'hot'}>爆品推荐</Menu.Item>
      <Menu.Item key={'today'}>限时推荐</Menu.Item>
      <Menu.Item key={'cancelRecommend'}>取消推荐</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomCenter" disabled={disabled}>
      <Button type="primary">推荐</Button>
    </Dropdown>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods,
  loadings: loading,
}))(SpecialRecommendMenu);
