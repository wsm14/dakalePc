import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const BusinessBrandSet = (props) => {
  const { dispatch, visible, onClose, cRef, loading, bankTopArr, initialValues } = props;

  const [form] = Form.useForm();
  const [code, setCode] = useState(false);

  useEffect(() => {
    setCode(false);
  }, [visible]);

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      const { bankBranchName } = values;
      const checkName = bankTopArr.filter((item) => bankBranchName.indexOf(item) > -1);
      dispatch({
        type: {
          false: 'businessBankSet/fetchMerBankAdd',
          true: 'businessBankSet/fetchMerBankEdit',
        }[!!initialValues],
        payload: {
          ...initialValues,
          bankBranchId: initialValues && initialValues.bankBranchIdString,
          ...values,
          bankName: !checkName.length
            ? bankBranchName.substring(0, bankBranchName.indexOf('银行')) + '银行'
            : checkName[0],
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  // 检查数据
  const hanleCheckData = () => {
    const bankname = form.getFieldValue('bankBranchName');
    const checkName = bankTopArr.filter((item) => bankname.indexOf(item) > -1);
    setCode(!checkName.length);
  };

  const formItems = [
    {
      label: '支行名称',
      name: 'bankBranchName',
      placeholder: '银行 + 城市 + 支行名称',
      onBlur: () => hanleCheckData(),
    },
    {
      label: '总行编码',
      name: 'bankCode',
      visible: code,
      extra: (
        <div>
          已存银行：
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {bankTopArr.map((item) => (
              <div style={{ width: '33.3%' }} key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={`设置支行`}
      width={600}
      visible={visible}
      destroyOnClose={true}
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
      <FormCondition formItems={formItems} form={form} initialValues={initialValues} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({ loading: loading.models.businessBankSet }))(
  BusinessBrandSet,
);
