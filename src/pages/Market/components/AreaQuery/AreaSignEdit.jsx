import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const AreaSignEdit = (props) => {
  const { dispatch, callBack, visible, onClose, loading } = props;
  const { show = false, detail = {} } = visible;
  const { id } = detail;

  const [form] = Form.useForm();

  const editType = authCheck(['edit']);

  // 新增
  const fetchCityManageSet = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'areaQuery/fetchAreaQueryInfoSet',
        payload: {
          id,
          ...values,
        },
        callback: () => {
          onClose();
          callBack();
        },
      });
    });
  };

  const formItems = [
    {
      label: '是否签约',
      type: 'radio',
      name: 'status',
      select: { 1: '未签', 2: '已签' },
      disabled: !editType.includes('edit'),
    },
    {
      label: '备注',
      type: 'textArea',
      name: 'remark',
      disabled: !editType.includes('edit'),
    },
  ];

  const modalProps = {
    title: detail.name,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchCityManageSet()} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.areaQuery,
}))(AreaSignEdit);
