import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Alert } from 'antd';
import { BUS_BANKACCOUNT_TYPE } from '@/common/constant';
import AccountInfo from './Form/Activate/AccountInfo';
import ServerFree from './Form/Activate/ServerFree';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const GroupActivate = (props) => {
  const { cRef, visible, onClose, dispatch, loading } = props;

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
      const { city, activeBeginDate = [], bankBindingInfo, bankAccountType } = values;
      dispatch({
        type: 'groupSet/fetchMerchantBank',
        payload: {
          merchantGroupId: merchantGroupIdString,
          bankAccountType,
          bankBindingObject: {
            ...bankBindingInfo,
            provCode: city[0].includes('00') ? city[0] : '00' + city[0],
            areaCode: city[1] || undefined,
            startDate: activeBeginDate[0]?.format('YYYY-MM-DD') || undefined,
            legalCertIdExpires: activeBeginDate[1]?.format('YYYY-MM-DD') || undefined,
          },
        },
        callback: () => {
          cRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const formItems = [
    {
      label: '账户类型',
      type: 'radio',
      name: 'bankAccountType',
      select: BUS_BANKACCOUNT_TYPE,
      disabled: bankStatus === '2',
      onChange: (e) => setBankAccount(e.target.value),
    },
  ];

  const modalProps = {
    title: `激活账户信息`,
    visible: show,
    onClose,
    afterCallBack: () => {
      setBankAccount(detail.bankAccountType);
    },
    footer: (
      <Button onClick={fetchUpData} type="primary" loading={loading}>
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
      <AccountInfo form={form} bankAccount={bankAccount} initialValues={detail}></AccountInfo>
      {/* 服务费比例 */}
      <ServerFree form={form} initialValues={detail}></ServerFree>
    </DrawerCondition>
  );
};

export default connect(({ groupSet, loading }) => ({
  list: groupSet.list.list,
  loading: loading.effects['groupSet/fetchMerchantBank'],
}))(GroupActivate);
