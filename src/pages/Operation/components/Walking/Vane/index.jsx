import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { DragHandle } from '@/components/TableDataBlock/SortBlock';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import VaneDrawer from './VaneDrawer';

const VaneManage = (props) => {
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

  // 排序
  const fetchDetailSort = (list) => {
    dispatch({
      type: 'walkingManage/fetchWalkManageVaneSort',
      payload: {
        configWindVaneDTOList: list.map((item, i) => ({
          configWindVaneId: item.configWindVaneId,
          sort: i,
        })),
      },
      callback: childRef.current.fetchGetData,
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '图标',
      dataIndex: 'image',
      render: (val) => <PopImgShow url={val}></PopImgShow>,
    },
    {
      title: '显示名称',
      dataIndex: 'name',
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
      fixed: 'right',
      align: 'right',
      dataIndex: 'configWindVaneId',
      render: (val, record) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                auth: true,
                click: () => fetchGetDetail(val, 'detail'),
              },
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
        tableSort={{ key: 'configWindVaneId', onSortEnd: fetchDetailSort }}
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
        rowKey={(record) => `${record.configWindVaneId}`}
        dispatchType="walkingManage/fetchWalkManageVaneList"
        pagination={false}
        {...list}
      ></TableDataBlock>
      <VaneDrawer cRef={childRef} visible={visible} onClose={() => setVisible(false)}></VaneDrawer>
    </>
  );
};

export default connect(({ walkingManage, loading }) => ({
  list: walkingManage.vaneList,
  loading:
    loading.effects['walkingManage/fetchWalkManageVaneList'] ||
    loading.effects['walkingManage/fetchWalkManageVaneEditDel'] ||
    loading.effects['walkingManage/fetchWalkManageVaneDetail'] ||
    loading.effects['walkingManage/fetchWalkManageVaneSort'],
}))(VaneManage);
