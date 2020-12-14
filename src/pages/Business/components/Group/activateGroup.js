import React, { useState, useRef, useEffect } from 'react';
import { Button, Drawer, Space, Form, notification } from 'antd';
import FormCondition from '@/components/FormCondition';
import Title from './title';
import ActiveSetForm from './Form/activeSetForm';
import LegalForm from './Form/legalForm';
import { connect } from 'umi';
import { TIME_YMD } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import moment from 'moment';
const addGroups = (props) => {
  const {
    onClose,
    visible = false,
    dispatch,
    visible1,
    saveVisible,
    merchantGroupId,
    businessLicense,
    bankBindingInfo,
    childRef,
  } = props;
  const [form] = Form.useForm();
  const cRef = useRef();
  const panelList = [
    {
      title: '对公账户信息',
      form: (
        <ActiveSetForm
          cRef={cRef}
          form={form}
          initialValues={{ ...businessLicense, ...bankBindingInfo }}
        />
      ),
      showArrow: false,
      disabled: true,
    },
    {
      title: '法人信息',
      form: (
        <LegalForm
          cRef={cRef}
          form={form}
          initialValues={{ ...businessLicense, ...bankBindingInfo }}
        />
      ),
      showArrow: false,
      disabled: true,
    },
  ];

  const fetchAddCard = (callback) => {
    form.validateFields().then((val) => {
      let city = cRef.current.getCity();
      const { activeBeginDate } = val;
      let startDate = TIME_YMD(activeBeginDate[0]);
      let legalCertIdExpires = TIME_YMD(activeBeginDate[1]);
      let obj = {
        ...val,
      };
      const {
        businessLicenseImg,
        businessName,
        businessScope,
        signInAddress,
        socialCreditCode,
        validityPeriod,
        bankBranchName,
        provCode,
        areaCode,
        areaName,
        legalPerson,
        legalMp,
        cardNo,
        openAccountPermit,
        certFrontPhoto,
        certReversePhoto,
        legalCertId,
        cardName,
      } = obj;
      dispatch({
        type: 'groupSet/fetchMerchantBank',
        payload: {
          merchantGroupId,
          businessLicenseObject: {
            businessLicenseImg,
            businessName,
            businessScope,
            signInAddress,
            socialCreditCode,
            validityPeriod,
          },
          bankBindingObject: {
            bankBranchName,
            provCode,
            areaCode,
            areaName,
            legalPerson,
            legalMp,
            cardNo,
            openAccountPermit,
            certFrontPhoto,
            certReversePhoto,
            ...city,
            cardName,
            startDate: startDate.replace(/-/g, ''),
            legalCertIdExpires: legalCertIdExpires.replace(/-/g, ''),
            legalCertId,
          },
        },
        callback: callback,
      });
    });
  };
  console.log(businessLicense,bankBindingInfo)
  return (
    <>
      <Drawer
        title={`激活账户信息`}
        width={660}
        visible={visible1}
        destroyOnClose={true}
        onClose={onClose}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => saveVisible({ visible1: false })}>取消</Button>
              <Button
                onClick={() =>
                  fetchAddCard(() => {
                    childRef.current.fetchGetData();
                    saveVisible({ visible1: false });
                  })
                }
                type="primary"
              >
                保存
              </Button>
            </Space>
          </div>
        }
      >

        <Title panelList={panelList}></Title>
      </Drawer>
    </>
  );
};

export default connect(({ groupSet, loading }) => ({
  ...groupSet,
}))(addGroups);
