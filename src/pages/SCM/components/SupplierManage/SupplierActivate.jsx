import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import ActivateAccountInfo from './Form/ActivateAccountInfo';

/**
 * 对公对私激活
 */
const SupplierActivate = (props) => {
  const { cRef, visible, onClose, dispatch, loading } = props;

  const { show, detail = {} } = visible;

  const [form] = Form.useForm();
  const [bankAccount, setBankAccount] = useState('1'); // 1 对公 2 对私

  const { id: supplierId } = detail;

  // 提交数据
  const fetchUpData = () => {
    form.validateFields().then(async (values) => {
      const { city, activeBeginDate = [], additionalVoucher, ...other } = values;
      const imgUrl = await aliOssUpload(additionalVoucher);
      dispatch({
        type: 'supplierManage/fetchSupplierActivateAccount',
        payload: {
          ...other,
          supplierId,
          bankAccount,
          additionalVoucher: imgUrl.toString(),
          provCode: city[0].includes('00') ? city[0] : '00' + city[0],
          areaCode: city[1] || undefined,
          startDate: activeBeginDate[0]?.format('YYYYMMDD') || undefined,
          [['', 'legalCertIdExpires', 'certExpireDate'][bankAccount]]:
            activeBeginDate[1]?.format('YYYYMMDD') || undefined,
        },
        callback: () => {
          cRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const modalProps = {
    title: `账户激活`,
    visible: show,
    onClose,
    afterCallBack: () => {
      setBankAccount(detail.type);
    },
    footer: (
      <Button onClick={fetchUpData} type="primary" loading={loading}>
        提交审核
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {/* 对公对私表单 */}
      <ActivateAccountInfo form={form} bankAccount={bankAccount}></ActivateAccountInfo>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['supplierManage/fetchSupplierActivateAccount'] ||
    loading.effects['groupSet/fetchGetOcrBankLicense'] ||
    loading.effects['groupSet/fetchGetOcrIdBankCard'] ||
    loading.effects['groupSet/fetchGetOcrIdCardFront'] ||
    loading.effects['groupSet/fetchGetOcrIdCardBack'],
}))(SupplierActivate);
