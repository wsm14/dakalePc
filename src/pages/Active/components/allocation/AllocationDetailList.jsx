import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import AllocationSet from './AllocationSet';

const AllocationDetailList = (props) => {
  const { detailList, loading, visible, setVisible, dispatch } = props;

  const { record = '' } = visible;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState({ show: false });

  const getColumns = [
    {
      title: '封面图片',
      dataIndex: 'promotionImage',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '活动名称',
      dataIndex: 'promotionName',
    },
    {
      title: '跳转类型',
      dataIndex: 'jumpType',
    },
    {
      title: '跳转连接',
      dataIndex: 'jumpUrl',
      render: (val, records) =>
        ({
          h5: (
            <Ellipsis length={20} tooltip>
              {val}
            </Ellipsis>
          ),
          native: records.nativeName,
        }[records.jumpType]),
    },
    {
      title: '状态',
      dataIndex: 'promotionStatus',
      render: (val) => (val === '1' ? '上架' : '下架'),
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'promotionIdString',
      render: (val, records) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              pop: true,
              visible: records.promotionStatus === '1',
              title: '下架',
              click: () => fetchAllocationDetailStatus({ promotionId: val, promotionStatus: 0 }),
            },
            {
              type: 'own',
              pop: true,
              visible: records.promotionStatus === '0',
              title: '上架',
              click: () => fetchAllocationDetailStatus({ promotionId: val, promotionStatus: 1 }),
            },
            {
              type: 'edit',
              click: () =>
                setVisibleSet({ show: true, promotionId: val, records, position: record.type }),
            },
          ]}
        />
      ),
    },
  ];

  // 下架视频
  const fetchAllocationDetailStatus = (payload) => {
    dispatch({
      type: 'activeAllocation/fetchAllocationDetailStatus',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return (
    <>
      <Modal
        title={`活动配置 - ${record.name}`}
        width={1150}
        destroyOnClose
        footer={null}
        visible={visible}
        onCancel={() => setVisible('')}
      >
        <DataTableBlock
          btnExtra={
            <Button
              className="dkl_green_btn"
              onClick={() => setVisibleSet({ show: true, position: record.type })}
            >
              新增
            </Button>
          }
          cRef={childRef}
          CardNone={false}
          loading={loading}
          columns={getColumns}
          rowKey={(row) => `${row.promotionIdString}`}
          params={{ position: record.type }}
          dispatchType="activeAllocation/fetchAllocationDetail"
          componentSize="middle"
          {...detailList}
        ></DataTableBlock>
      </Modal>
      <AllocationSet
        {...visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet({ show: false })}
      ></AllocationSet>
    </>
  );
};

export default connect(({ activeAllocation, loading }) => ({
  detailList: activeAllocation.detailList,
  loading: loading.effects['activeAllocation/fetchAllocationDetail'],
}))(AllocationDetailList);
