import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import VaneDrawer from './VaneDrawer';

const VaneManage = (props) => {
  const { serviceFAQ, loading, dispatch } = props;
  const { list: FAQList } = serviceFAQ;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

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
      title: '图标',
      dataIndex: 'frontImage',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '显示名称',
      dataIndex: 'questionTitle',
      className: 'drag-visible',
    },
    {
      title: '排序',
      align: 'right',
      dataIndex: 'sort',
      render: () => <DragHandle />,
    },
    {
      title: '操作',
      dataIndex: 'userMomentIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              {
                type: 'edit',
                click: () => fetchShareDetail(val, record.contentType),
              },
              {
                type: 'del',
                click: () => fetchShareHandleDetail(val),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        tableSort={{ key: 'questionIdString', onSortEnd: (val) => console.log(val) }}
        cardProps={{
          title: '风向标配置',
          extra: (
            <Button type="primary" onClick={() => setVisible({ type: 'add', show: true })}>
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.questionIdString}`}
        params={{ userType: 'user' }}
        dispatchType="serviceFAQ/fetchGetList"
        {...FAQList}
      ></TableDataBlock>
      <VaneDrawer visible={visible} onClose={() => setVisible(false)}></VaneDrawer>
    </>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  serviceFAQ,
  loading: loading.models.serviceFAQ,
}))(VaneManage);
