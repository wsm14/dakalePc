import React, { useState } from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import { Pagination } from 'antd';

const HistoryFollow = (props) => {
  const { visible, onClose } = props;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState('100');

  const followItem = [
    {
      label: '跟进方式',
      name: 'pushObjectType',
    },
    {
      label: '跟进类型',
      name: 'pushObjectType',
    },
    {
      label: '跟进内容',
      name: 'pushObjectType',
      span: 2,
    },
    {
      label: '跟进标签',
      name: 'pushObjectType',
      span: 2,
    },
    {
      label: '跟进结果',
      name: 'pushObjectType',
      span: 2,
    },
  ];

  const modalProps = {
    title: '历史跟进情况',
    visible,
    onClose,
  };

  const handlePageChange = (val) => {
    setPage(val);
  };
  return (
    <DrawerCondition {...modalProps}>
      <div style={{ color: '#999', marginBottom: 15 }}>
        炜烽 <span style={{ marginLeft: 10 }}>2021-08-18 17:02</span>
      </div>
      <DescriptionsCondition
        title="用户信息"
        labelStyle={{ width: 120 }}
        formItems={followItem}
        column={2}
      ></DescriptionsCondition>
      {/* 分页数据 */}
      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          showSizeChanger
          onShowSizeChange={handlePageChange}
          defaultCurrent={page}
          total={total}
        />
      </div>
    </DrawerCondition>
  );
};
export default HistoryFollow;
