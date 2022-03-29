import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Button, Form } from 'antd';
import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import Search from './Search';

const GroupGoodModal = ({ visible = {}, onClose }) => {
  const { show = false } = visible;
  const [searchData, setSearchData] = useState({});

  const handleCOnfirm =()=>{

  }

  const modalProps = {
    title: ' 新增商品',
    visible: show,
    width: 800,
    onCancel:onClose,
    onOk:handleCOnfirm
  };

  // 搜索
  const onSearch = (values) => {
    dispatch({
      type: 'groupGoods/fetchListActivityForSearch',
      payload: {
        ...values,
      },
      callback:(list)=>{}
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
