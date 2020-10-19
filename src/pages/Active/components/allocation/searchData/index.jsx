import React, { useState } from 'react';
import { connect } from 'dva';
import { Modal, Input, Card, Row, Col } from 'antd';

const Merchant = (props) => {
  const {
    visible,
    onCancel,
    dispatch,
    onOk,
    loading,
    searchName,
    searchApi,
    itemkey,
    itemName,
  } = props;

  const [cardItem, setCardItem] = useState([]);

  const load = loading.effects[searchApi];

  // 获取详情
  const fetchGetDetail = (value) => {
    dispatch({
      type: searchApi,
      payload: { [searchName]: value },
      callback: setCardItem,
    });
  };

  return (
    <Modal zIndex={9999} title="搜索数据" destroyOnClose visible={visible} footer={null} onCancel={onCancel}>
      <Input.Search placeholder="" loading={load} onSearch={(val) => fetchGetDetail(val)} />
      <Row gutter={[20, 20]} style={{ marginTop: 20, maxHeight: 600, overflow: 'auto' }}>
        {cardItem.map((item) => (
          <Col key={item[itemkey]}>
            <Card
              style={{ width: 220 }}
              actions={[
                <div
                  onClick={() => {
                    onOk(item[itemkey]);
                    onCancel();
                  }}
                >
                  选择
                </div>,
              ]}
            >
              {itemName.map((val) => (
                <div key={val.title}>
                  {val.title}：{item[val.dataIndex]}
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(Merchant);
