import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import CrmGroupSelect from './Form/CrmGroupSelect';
import GroupInfoForm from './Form/GroupInfoForm';
import BusinessLicense from './Form/BusinessLicense';
import OhterInfoForm from './Form/OhterInfoForm';
import DrawerCondition from '@/components/DrawerCondition';

const GroupEdit = (props) => {
  const { visible = false, onClose, dispatch, cRef } = props;
  // 展示 表单内容类型 add edit 详情
  const { show, type, detail } = visible;

  const [form] = Form.useForm();
  const [formCrm] = Form.useForm();

  const [mreDetail, setMreDetail] = useState({}); // 集团详情
  const [crmSelect, setCrmSelect] = useState(true); // 是否显示crm 选择集团内容 新增显示

  // 认领或创建店铺前往新增
  const handleCrmAddGroup = (data) => {
    setMreDetail(data);
    setCrmSelect(false);
  };

  const modalProps = {
    title: type == 'edit' ? '修改集团信息' : `新增集团`,
    visible: show,
    width: 700,
    onClose,
    afterCallBack: () => {
      setMreDetail(detail || {});
      setCrmSelect(type === 'add');
    },
    footer: (
      <>
        <Button onClick={() => form.validateFields().then((res) => console.log(res))}>保存</Button>
        <Button onClick={() => {}} type="primary">
          下一步
        </Button>
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {/* 基础信息 */}
      <GroupInfoForm form={form} formType={type} initialValues={mreDetail}></GroupInfoForm>
      {/* 营业执照信息 */}
      <BusinessLicense form={form} formType={type}></BusinessLicense>
      {/* 品牌信息 && 登录信息 && 联系人信息 && 店铺信息 */}
      <OhterInfoForm form={form} formType={type} initialValues={mreDetail}></OhterInfoForm>
      {/* <CrmGroupSelect form={formCrm} goSet={handleCrmAddGroup} /> */}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadingAdd: loading.effects['groupSet/fetchAddList'],
  loadingUpDate: loading.effects['groupSet/fetchUpdateGroup'],
}))(GroupEdit);
