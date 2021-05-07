import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';

const NewsPeople = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = (val, type) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneDetail',
      payload: {
        configWindVaneId: val,
      },
      callback: (detail) => setVisible({ show: true, type, detail }),
    });
  };

  // 删除
  const fetchDetailDel = (configWindVaneId) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneEditDel',
      payload: {
        configWindVaneId,
        deleteFlag: 0,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '新手福利',
      dataIndex: 'name',
    },
    {
      title: '必须使用卡豆支付',
      dataIndex: 'name',
    },
    {
      title: '每单金额',
      dataIndex: 'name',
    },
    {
      title: '活动时间',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'name',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'configWindVaneId',
      render: (val, record) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                auth: true,
                click: () => fetchGetDetail(val, 'edit'),
              },
              {
                type: 'del',
                auth: true,
                click: () => fetchDetailDel(val),
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
          title: '新人下单配置',
          bordered: false,
          extra: (
            <Button type="primary" onClick={() => setVisible({ type: 'add', show: true })}>
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.configWindVaneId}`}
        // dispatchType="walkingManage/fetchWalkManageVaneList"
        pagination={false}
        // {...list}
      ></TableDataBlock>
      {/* <VaneDrawer cRef={childRef} visible={visible} onClose={() => setVisible(false)}></VaneDrawer> */}
    </>
  );
};

export default connect(() => ({}))(NewsPeople);
