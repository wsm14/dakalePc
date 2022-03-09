import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { STROLLAROUND_TAB_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const ResourceContent = (props) => {
  const { dispatch, loading, editionList } = props;
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('iOS');

  const childRef = useRef();

  const getColumns = [
    {
      title: '活动名称',
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: '关联模板名称',
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: '活动商品数',
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'version',
    },
    {
      type: 'handle',
      // align: 'center',
      dataIndex: 'configWanderAroundModuleId',
      render: (val, row) => [
        {
          type: 'edit',
          title: '编辑详情',
          click: () => {
            setVisible({
              show: true,
              type: 'edit',
              detail: row,
            });
          },
          auth: true,
        },
        {
          type: 'del',
          click: () => {
            console.log('del', val);
          },
          auth: true,
        },
      ],
    },
  ];

  return (
    <TableDataBlock
      order
      cardProps={{ title: '资源位内容配置' }}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      pagination={false}
      rowKey={(record) => `${record.configWanderAroundModuleId}`}
      params={{ userOs: tabKey, area: 'all' }}
      dispatchType="walkingManage/fetchAroundModuleList"
      {...editionList}
    />
  );
};

export default connect(({ loading, walkingManage }) => ({
  editionList: walkingManage.editionList,
  loading: loading.models.walkingManage,
}))(ResourceContent);
