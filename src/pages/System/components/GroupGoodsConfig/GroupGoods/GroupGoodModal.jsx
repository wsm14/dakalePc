import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Button, Form } from 'antd';
import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import Search from './Search';

const GroupGoodModal = () => {
  const [searchData, setSearchData] = useState({});
  const modalProps = {
    title: ' 新增商品',
    visible: false,
    width: 800,
  };
  //  搜索
  const onSearch = (values) => {
    dispatch({
      type: '',
      payload: {
        ...values,
      },
    });
  };

  return (
    <Modal {...modalProps}>
      <div style={{ marginBottom: 20 }}>
        <Search onSearch={onSearch}></Search>
      </div>
      {groupGoods()}
    </Modal>
  );
};

export default connect()(GroupGoodModal);
