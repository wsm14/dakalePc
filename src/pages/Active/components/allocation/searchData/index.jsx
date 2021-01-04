import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Input, Card, Row, Col, Pagination } from 'antd';

const Merchant = (props) => {
  const {
    visible,
    onCancel,
    dispatch,
    onOk,
    loading,
    searchInput = true,
    searchName,
    searchApi,
    itemkey,
    itemName,
  } = props;

  const [cardItem, setCardItem] = useState({ list: [], total: 0 });
  const [page, setPage] = useState({ limit: 10, page: 1 });
  const [search, setSearch] = useState('');

  const load = loading.effects[searchApi];

  // 获取详情
  const fetchGetDetail = () => {
    let sName = searchName;
    if (Array.isArray(searchName)) {
      let stype = 'number';
      if (isNaN(Number(search))) {
        stype = 'string';
      }
      sName = searchName.filter(({ type }) => type === stype)[0].name;
    }
    if (searchInput && !search) return;
    dispatch({
      type: searchApi,
      payload: { [sName]: search, ...page },
      callback: setCardItem,
    });
  };

  useEffect(() => {
    fetchGetDetail();
  }, [page, search]);

  return (
    <Modal title="搜索数据" destroyOnClose visible={visible} footer={null} onCancel={onCancel}>
      {searchInput && (
        <Input.Search placeholder="" loading={load} onSearch={(val) => setSearch(val)} />
      )}
      <Row gutter={[20, 20]} style={{ marginTop: 20, maxHeight: 600, overflow: 'auto' }}>
        {cardItem.list.map((item) => (
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
                  {val.title}：{val.render ? val.render(item[val.dataIndex]) : item[val.dataIndex]}
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: 'center' }}>
        <Pagination
          hideOnSinglePage
          onChange={(page) => setPage({ limit: 10, page })}
          defaultCurrent={page.page}
          total={cardItem.total}
          showTotal={() => `共 ${cardItem.total} 条`}
        />
      </div>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(Merchant);
