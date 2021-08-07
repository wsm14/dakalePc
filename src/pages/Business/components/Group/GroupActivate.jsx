import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Alert } from 'antd';
import { BUS_BANKACCOUNT_TYPE } from '@/common/constant';
import AccountInfo from './Form/Activate/AccountInfo';
import ServerFree from './Form/Activate/ServerFree';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const GroupActivate = (props) => {
  const { visible, onClose, dispatch, loading } = props;

  const { show, detail = {} } = visible;

  const [form] = Form.useForm();
  const [bankAccount, setBankAccount] = useState('1'); // 1 对公 2 对私

  /**
   * bankStatus 激活状态
   * bankRejectReason 激活失败原因
   * merchantGroupIdString: 集团id
   */
  const { bankStatus, bankRejectReason, merchantGroupIdString } = detail;

  // 提交数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      console.log({ merchantGroupId: merchantGroupIdString, ...values });
    });
  };

  const formItems = [
    {
      label: '账户类型',
      type: 'radio',
      name: 'bankAccountType',
      select: BUS_BANKACCOUNT_TYPE,
      onChange: (e) => setBankAccount(e.target.value),
    },
  ];

  const modalProps = {
    title: `激活账户信息`,
    visible: show,
    onClose,
    loading,
    footer: (
      <Button onClick={fetchUpData} type="primary">
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {bankStatus === '2' && bankRejectReason && (
        <Alert
          style={{ marginBottom: '12px' }}
          message={`失败原因：${bankRejectReason}`}
          type="error"
          showIcon
        />
      )}
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
      {/* 对公对私表单 */}
      <AccountInfo form={form} initialValues={detail} bankAccount={bankAccount}></AccountInfo>
      {/* 服务费比例 */}
      <ServerFree form={form} initialValues={detail}></ServerFree>
    </DrawerCondition>
  );
};

export default connect(({ groupSet, loading }) => ({
  list: groupSet.list.list,
  loading: loading.effects['groupSet/fetchGrounpDetails'],
  loadingBank: loading.effects['groupSet/fetchGroupSetBandCode'],
}))(GroupActivate);
