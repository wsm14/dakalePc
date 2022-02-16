import React from 'react';
import { connect } from 'umi';
import { Modal, Form } from 'antd';
import CITYJSON from '@/common/cityJson';
import FormCondition from '@/components/FormCondition';

const CityManageSet = (props) => {
  const { visible, onClose, cRef, dispatch, loading } = props;
  const { show = false, detail = {} } = visible;
  const { agentCityCode, cityId } = detail;

  const [form] = Form.useForm();

  // 提交表单
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'cityCompany/fetchCityManageDistrictSet',
        payload: {
          cityId,
          ...values,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '设置可管理区县',
      type: 'select',
      name: 'manageDistrictCodeList',
      select: CITYJSON.filter((item) => item.pid === agentCityCode),
      fieldNames: { label: 'name', value: 'id' },
      mode: 'multiple',
    },
  ];

  const modalProps = {
    title: `设置`,
    visible: show,
    width: 550,
    destroyOnClose: true,
    loading,
    onCancel: () => onClose(),
    onOk: () => fetchGetFormData(),
  };

  return (
    <Modal {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail} />
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['cityCompany/fetchCityManageDistrictSet'],
}))(CityManageSet);
