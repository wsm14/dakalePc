import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Tabs } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const { TabPane } = Tabs;

const AreaSignEdit = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const { show = false, detail = {} } = visible;
  const { id, level } = detail;

  const checkIdType = { 2: 'pid', 3: 'id' }[level];

  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState('0');

  // 新增
  const fetchCityManageSet = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'manageCity/fetchCityManageSet',
        payload: {
          ...detail,
          ...values,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '是否签约',
      type: 'radio',
      name: 'status',
      select: ['已签', '未签'],
    },
    {
      label: '备注',
      type: 'textArea',
      name: 'remark',
    },
  ];

  const modalProps = {
    title: detail.name,
    visible: show,
    onClose,
    afterCallBack: () => {
      setTabKey('0');
    },
    footer: (
      <Button type="primary" onClick={() => fetchCityManageSet()} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.manageCity,
}))(AreaSignEdit);
