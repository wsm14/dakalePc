import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const ClassifySet = (props) => {
  const { dispatch, visible = {}, onClose, cRef, loading, classifyManage } = props;
  const { type = '', detail = {} } = visible;
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

  // 搜索店铺
  const fetchClassifyGetMre = debounce((keyword) => {
    if (!keyword) {
      setEditLoading(false);
      return;
    }
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

  const modalProps = {
    title: '设置分类',
    visible: !!type,
    onClose,
    afterCallBack: () => {
      if (type == 'edit') {
        fetchClassifyGetMre(detail.merchantName);
      }
    },
    footer: (
      <Button onClick={fetchUpData} type="primary" loading={loading || editLoading}>
        确认
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail} />
    </DrawerCondition>
  );
};

export default connect(({ classifyManage, loading }) => ({
  classifyManage,
  loading: loading.models.classifyManage,
}))(ClassifySet);
