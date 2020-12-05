import React, { useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, Skeleton } from 'antd';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';

const ClassifySet = (props) => {
  const { dispatch, visible = {}, onClose, cRef, loading, classifyManage } = props;
  const { type = '', detail } = visible;
  const { merFormSelect } = classifyManage;

  const [form] = Form.useForm();
  const [editLoading, setEditLoading] = useState(true);

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: {
          add: 'classifyManage/fetchClassifyAdd',
          edit: 'classifyManage/fetchClassifyEdit',
        }[type],
        payload: {
          ...values,
          categoryCustomId: detail.categoryCustomId,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  // 搜索商户
  const fetchClassifyGetMre = debounce((keyword) => {
    if (!keyword) return;
    dispatch({
      type: 'classifyManage/fetchClassifyGetMre',
      payload: {
        limit: 999,
        page: 1,
        keyword,
        type,
      },
      callback: () => setEditLoading(false),
    });
  }, 500);

  const formItems = [
    {
      label: '选择店铺',
      name: 'merchantIdStr',
      type: 'select',
      loading,
      disabled: type == 'edit',
      placeholder: '请输入搜索',
      select: merFormSelect,
      onSearch: (val) => fetchClassifyGetMre(val),
    },
    {
      label: '添加分类',
      name: 'categoryName',
      placeholder: '请先选择店铺',
    },
  ];

  return (
    <Drawer
      title={`设置分类`}
      width={600}
      visible={!!type}
      destroyOnClose={true}
      afterVisibleChange={(show) => {
        setEditLoading(true);
        if (show && type == 'edit') {
          fetchClassifyGetMre(detail.merchantName);
        }
      }}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchUpData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <Skeleton loading={type == 'edit' && editLoading} active>
        <FormCondition formItems={formItems} form={form} initialValues={detail} />
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ classifyManage, loading }) => ({
  classifyManage,
  loading: loading.models.classifyManage,
}))(ClassifySet);
