import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { RESOURCE_NAME } from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import ResourceContentDrawer from './ResourceContentDrawer';

const ResourceContent = (props) => {
  const { dispatch, loading, resourceList } = props;
  const [visible, setVisible] = useState(false);

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '活动名称',
      name: 'name',
    },
    {
      label: '关联模板名称',
      name: 'templateName',
      type: 'select',
      select: RESOURCE_NAME,
      allItem: false,
    },
  ];

  const getColumns = [
    {
      title: '活动名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
    {
      title: '关联模板名称',
      align: 'center',
      dataIndex: 'templateName',
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      type: 'handle',
      // align: 'center',
      dataIndex: 'templateId',
      render: (val, row) => [
        {
          type: 'edit',
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

  const btnList = [
    {
      text: '新增',
      auth: 'save',
      onClick: () => setVisible({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        cardProps={{
          title: '资源位内容配置',
          extra: <ExtraButton list={btnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.templateId}`}
        params={{ deleteFlag: 1 }}
        dispatchType="walkingManage/fetchPageResourceTemplateContent"
        {...resourceList}
      />
      {/* 新增 详情 */}
      <ResourceContentDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></ResourceContentDrawer>
    </>
  );
};

export default connect(({ loading, walkingManage }) => ({
  resourceList: walkingManage.resourceList,
  loading: loading.models.walkingManage,
}))(ResourceContent);
