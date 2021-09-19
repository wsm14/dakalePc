import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import GlobalPopSet from './components/GlobalPop/GlobalPopSet'

const GlobalPop = (props) => {
  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false);
  // 搜索参数
  const searchItems = [
    {
      label: '弹窗名称',
      name: 'username',
    },
    {
      label: '状态',
      type: 'select',
      name: 'status',
    },
    {
      label: '展示区域',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '弹窗位置',
      type: 'select',
      name: 'position',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '弹窗图片',
      dataIndex: 'img',
    },
    {
      title: '弹窗名称',
      dataIndex: 'id',
      width: 300,
      ellipsis: { length: 50 },
    },
    {
      title: '弹窗位置',
      dataIndex: 'id',
    },
    {
      title: '跳转位置',
      dataIndex: 'id',
    },
    {
      title: '展示区域',
      dataIndex: 'id',
    },
    {
      title: '展示权重',
      dataIndex: 'status',
    },
    {
      title: '创建人',
      dataIndex: 'status',
    },
    {
      title: '活动时间',
      dataIndex: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'status',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'status',
      render: (val) => [
        {
          type: 'down',
          // click: () => fetchFeedBackDetail({ feedbackIdString }),
        },
        {
          type: 'edit',
          click: () => handleSet(val, 'edit'),
        },
      ],
    },
  ];

  const handleSet = (val, type) => {
    setVisibleSet({
      show: true,
      type,
      detail: {},
    });
  };

  const btnList = [
    {
      auth: 'save',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];

  return (
      <>
    <TableDataBlock
      cRef={childRef}
      btnExtra={btnList}
      //   loading={loading}
      searchItems={searchItems}
      columns={getColumns}
      rowKey={(record) => `${record.newsIdString}`}
      dispatchType="serviceNews/fetchGetList"
      //   {...serviceNews}
    ></TableDataBlock>
    <GlobalPopSet visible={visibleSet} onClose={()=>setVisibleSet(false)} childRef={childRef}></GlobalPopSet>
    </>
  );
};
export default connect()(GlobalPop);
