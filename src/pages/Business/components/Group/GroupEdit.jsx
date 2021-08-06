import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import CrmGroupSelect from './Form/CrmGroupSelect';
import DrawerCondition from '@/components/DrawerCondition';

const GroupEdit = (props) => {
  const { visible = false, onClose, dispatch, cRef } = props;
  // 展示 表单内容类型 add edit 详情
  const { show, type, detail } = visible;

  const [formCrm] = Form.useForm();

  const [mreDetail, setMreDetail] = useState(); // 集团详情
  const [crmSelect, setCrmSelect] = useState(true); // 是否显示crm 选择集团内容 新增显示

  // 认领或创建店铺前往新增
  const handleCrmAddGroup = (data) => {
    setMreDetail(data);
    setCrmSelect(false);
  };

  const modalProps = {
    title: type == 'edit' ? '修改集团信息' : `新增集团`,
    visible: show,
    onClose,
    afterCallBack: () => {
      setMreDetail(detail || {});
      setCrmSelect(type === 'add');
    },
    footer: null,
  };

  return (
    <DrawerCondition {...modalProps}>
      <CrmGroupSelect form={formCrm} goSet={handleCrmAddGroup} />
    </DrawerCondition>
  );
};

export default connect(({ sysTradeList, groupSet, loading }) => ({
  ...sysTradeList,
  ...groupSet,
  loadingAdd: loading.effects['groupSet/fetchAddList'],
  loadingUpDate: loading.effects['groupSet/fetchUpdateGroup'],
}))(GroupEdit);
