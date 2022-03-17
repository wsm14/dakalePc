import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import ResourceContentDrawer from './ResourceContentDrawer';

const ResourceContent = (props) => {
  const { dispatch, loading, resourceList, resourceTemplateList } = props;
  const [visible, setVisible] = useState(false);

  const childRef = useRef();

  useEffect(() => {
    dispatch({
      type: 'walkingManage/fetchListResourceTemplate',
      payload: { deleteFlag: 1 },
    });
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '活动名称',
      name: 'name',
    },
    {
      label: '关联模板名称',
      name: 'templateId',
      type: 'select',
      select: resourceTemplateList,
      fieldNames: {
        label: 'templateName',
        value: 'resourceTemplateId',
      },
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
      dataIndex: 'resourceTemplateContentId',
      render: (val, row) => [
        {
          type: 'edit',
          click: () => {
            handleDetail(val);
          },
          auth: true,
        },
        {
          type: 'del',
          click: () => {
            handleDelete(val);
          },
          auth: true,
        },
      ],
    },
  ];

  const handleDelete = (resourceTemplateContentId) => {
    dispatch({
      type: 'walkingManage/fetchDeleteResourceTemplateContent',
      payload: {
        resourceTemplateContentId,
      },
      callback: () => {
        childRef.current.fetchGetData();
      },
    });
  };

  // 获取详情
  const handleDetail = (resourceTemplateContentId) => {
    dispatch({
      type: 'walkingManage/fetchGetResourceTemplateContentById',
      payload: {
        resourceTemplateContentId,
      },
      callback: (detail) => {
        setVisible({ type: 'edit', show: true, detail });
      },
    });
  };

  const btnList = [
    {
      text: '新增',
      type: 'save',
      auth: true,
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
  resourceTemplateList: walkingManage.resourceTemplateList.list,
  resourceList: walkingManage.resourceList,
  loading: loading.models.walkingManage,
}))(ResourceContent);
