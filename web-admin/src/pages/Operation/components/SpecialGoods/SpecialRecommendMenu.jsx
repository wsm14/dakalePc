import React from 'react';
import { connect } from 'umi';
import { SPECIAL_RECOMMEND_TYPE } from '@/common/constant';
import { Button, Menu, Dropdown } from 'antd';

const SpecialRecommendMenu = (props) => {
  const { disabled, handleRecommend, num, tabKey } = props;

  const menu = (
    <Menu onClick={({ key }) => handleRecommend({ recommendType: key })}>
      {tabKey === '0' ? (
        Object.keys(SPECIAL_RECOMMEND_TYPE).map((item) => (
          <Menu.Item key={item}>{SPECIAL_RECOMMEND_TYPE[item]}</Menu.Item>
        ))
      ) : (
        <Menu.Item key={'selfTour'}>自我游</Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomCenter" disabled={disabled}>
      <Button type="primary">推荐{num ? `(已选${num})` : ''}</Button>
    </Dropdown>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods,
  loadings: loading,
}))(SpecialRecommendMenu);
