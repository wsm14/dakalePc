import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import TableDataBlock from '@/components/TableDataBlock';
import DndDragContext from '@/components/DndDragContext';

const VaneManage = (props) => {
  const { serviceFAQ, loading, dispatch, style } = props;
  const { list: FAQList } = serviceFAQ;

  const childRef = useRef();
  const [list, setList] = useState([
    { value: 1, name: 111111 },
    { value: 2, name: 222222 },
    { value: 3, name: 333333 },
  ]);

  // 获取详情
  const fetchShareDetail = (val, type) => {
    dispatch({
      type: 'shareManage/fetchShareDetail',
      payload: {
        userMomentIdString: val,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '类目',
      dataIndex: 'questionTitle',
      className: 'drag-visible',
    },
    {
      title: '场景',
      dataIndex: 'id',
      render: (val, row) => (
        <DndDragContext accept={row.questionTitle} data={list} onEnd={(val) => setList(val)}>
          {list.map((item) => (
            <Tag color="orange" key={item.value}>
              {item.name}
            </Tag>
          ))}
        </DndDragContext>
      ),
    },
    {
      title: '排序',
      align: 'right',
      dataIndex: 'sort',
      render: () => <DragHandle />,
    },
  ];

  return (
    <>
      <TableDataBlock
        tableSort={{ key: 'questionIdString', onSortEnd: (val) => console.log(val) }}
        cardProps={{ title: '导航类目页面配置', style }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.questionIdString}`}
        params={{ userType: 'user' }}
        dispatchType="serviceFAQ/fetchGetList"
        {...FAQList}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  serviceFAQ,
  loading: loading.models.serviceFAQ,
}))(VaneManage);
