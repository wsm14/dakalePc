import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, notification } from 'antd';
import { checkFileData } from '@/utils/utils';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import BaseInfoForm from './Form/Info/BaseInfoForm';
import IntelligenceForm from './Form/Info/IntelligenceForm';
import OhterInfoForm from './Form/Info/OhterInfoForm';

const SupplierManageAddEdit = (props) => {
  const { cRef, visible = false, dispatch, onClose, loading } = props;
  // 表单内容类型 mode: add edit
  const { show, mode, detail = {} } = visible;

  const [form] = Form.useForm();
  const [bankAccount, setBankAccount] = useState('1'); // 1 对公 2 对私

  // 提交数据
  const fetchUpAllData = () => {
    form.validateFields().then((values) => {
      const { lat, lnt } = values;
      if (!lat && !lnt) {
        notification.error({
          message: '请点击查询！设置经纬度',
        });
        return;
      }
      const { allCode, activeValidity, classifyIds, proofInfoObject, ...other } = values;
      const { systemApprove, productApprove } = proofInfoObject;
      const sImg = checkFileData(systemApprove);
      const pImg = checkFileData(productApprove);
      aliOssUpload([...sImg, ...pImg]).then((res) => {
        dispatch({
          type: 'supplierManage/fetchSupplierManageSet',
          payload: {
            mode,
            ...other,
            supplierId: detail.supplierId,
            provinceCode: allCode[0],
            cityCode: allCode[1],
            districtCode: allCode[2],
            classifyIds: classifyIds.toString(),
            proofInfoObject: {
              ...proofInfoObject,
              systemApprove: res.slice(0, sImg.length).toString(),
              productApprove: res.slice(sImg.length).toString(),
              validityPeriod: activeValidity[1].format('YYYY-MM-DD'),
              establishDate: activeValidity[0].format('YYYY-MM-DD'),
            },
          },
          callback: () => {
            cRef.current.fetchGetData(); // 保存
            onClose();
          },
        });
      });
    });
  };

  const modalProps = {
    title: mode == 'edit' ? '修改供应商' : `新增供应商`,
    visible: show,
    width: 700,
    onClose,
    afterCallBack: () => {
      // 获取主营类目
      dispatch({ type: 'baseData/fetchParentListClassify' });
    },
    footer: (
      <Button type="primary" onClick={fetchUpAllData} loading={loading}>
        提交审核
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {/* 基础信息 */}
      <BaseInfoForm
        form={form}
        initialValues={detail}
        setBankAccount={setBankAccount}
      ></BaseInfoForm>
      {/* 联系人信息 & 介绍人信息 */}
      <OhterInfoForm form={form} initialValues={detail}></OhterInfoForm>
      {/* 资质信息 */}
      <IntelligenceForm form={form} initialValues={detail}></IntelligenceForm>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['supplierManage/fetchSupplierManageSet'],
}))(SupplierManageAddEdit);
