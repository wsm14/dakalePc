import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';

const VaneManage = (props) => {
  const { shareManage, loading, dispatch, style } = props;

  const childRef = useRef();
  const [visibleDown, setVisibleDown] = useState(false); // 下架原因

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
      fixed: 'left',
      dataIndex: 'frontImage',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '显示名称',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '移动',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '操作',
      dataIndex: 'userMomentIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'down',
                visible: status == 1 || status == 5,
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              {
                type: 'info',
                click: () => fetchShareDetail(val, record.contentType),
              },
              {
                type: '操作记录',
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
        cardProps={{
          title: '特惠商品类目配置',
          extra: <Button type="primary">新增</Button>,
          style,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.userMomentIdString}`}
        {...shareManage}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ shareManage, loading }) => ({
  shareManage,
  loading: loading.models.shareManage,
}))(VaneManage);
