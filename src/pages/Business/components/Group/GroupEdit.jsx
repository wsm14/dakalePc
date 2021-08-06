import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { checkFileData } from '@/utils/utils';
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

  // 提交集团数据
  const fetchUpGroupData = (handle) => {
    form.validateFields().then((values) => {
      const {
        localImages,
        mainImages,
        activeValidity,
        topCategSelect,
        businessLicenseObject,
        allCode,
        ...other
      } = values;
      const lImg = checkFileData(localImages);
      const mImg = checkFileData(mainImages);
      aliOssUpload([...lImg, ...mImg]).then((res) => {
        dispatch({
          type: { add: 'groupSet/fetchAddList', edit: 'groupSet/fetchUpdateGroup' }[type],
          payload: {
            ...other,
            provinceCode: allCode[0],
            cityCode: allCode[1],
            districtCode: allCode[2],
            categoryNode: topCategSelect.join('.'),
            businessLicenseObject: {
              ...businessLicenseObject,
              validityPeriod: activeValidity[1].format('YYYY-MM-DD'),
              establishDate: activeValidity[0].format('YYYY-MM-DD'),
            },
            localImages: res.slice(0, lImg.length).toString(),
            mainImages: res.slice(lImg.length).toString(),
          },
          callback: () => {
            // 保存和下一步
            if (handle === 'save') {
              cRef.current.fetchGetData();
              onClose();
            } else {
              onClose();
            }
          },
        });
      });
    });
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
        <Button onClick={() => fetchUpGroupData('save')}>保存</Button>
        {type === 'add' && (
          <Button onClick={() => fetchUpGroupData('next')} type="primary">
            下一步
          </Button>
        )}
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {crmSelect ? (
        <CrmGroupSelect form={formCrm} goSet={handleCrmAddGroup} /> // 认领页面
      ) : (
        <>
          {/* 基础信息 */}
          <GroupInfoForm form={form} formType={type} initialValues={mreDetail}></GroupInfoForm>
          {/* 营业执照信息 */}
          <BusinessLicense form={form} formType={type}></BusinessLicense>
          {/* 品牌信息 && 登录信息 && 联系人信息 && 店铺信息 */}
          <OhterInfoForm form={form} formType={type} initialValues={mreDetail}></OhterInfoForm>
        </>
      )}
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadingAdd: loading.effects['groupSet/fetchAddList'],
  loadingUpDate: loading.effects['groupSet/fetchUpdateGroup'],
}))(GroupEdit);
