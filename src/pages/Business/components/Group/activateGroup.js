import React, {useState, useRef, useEffect} from 'react';
import {Button, Drawer, Space, Form,  Radio} from 'antd';
import Title from './title';
import ActiveSetForm from './Form/activeSetForm';
import LegalForm from './Form/legalForm';
import { connect } from 'umi';
import { TIME_YMD } from '@/common/constant';
import ActiveSetOneForm from './Form/activeByOneForm';
import ActiveBankForm from './Form/activeBankForm';
import LegalByOneForm from './Form/legalByOneForm';

const addGroups = (props) => {
  const {
    onClose,
    dispatch,
    visible1,
    saveVisible,
    merchantGroupId,
    childRef,
    loading,
    initial
  } = props;
  const options = [
    {
      label: '对公(企业、组织机构)',
      value: '1',
      disabled: bankAccountType === '2'
    },
    {label: '对私(个体工商户)'
      , value: '2',
      disabled: bankAccountType === '1'
    },
  ];
  useEffect(() => {
    if(bankAccountType){
      setBankAccount(bankAccountType)
    }
  }, [bankAccountType])
  const [form] = Form.useForm();
  const cRef = useRef();
  const [bankAccount, setBankAccount] = useState('2')
  const panelList = {
    '1': [
      {
        title: '对公账户信息',
        form: (
          <ActiveSetForm
            cRef={cRef}
            form={form}
            initialValues={{...businessLicense, ...bankBindingInfo}}
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
            initialValues={{...businessLicense, ...bankBindingInfo}}
          />
        ),
        showArrow: false,
        disabled: true,
      },
    ],
    '2': [
      {
        title: '对私账户信息',
        form: (
          <ActiveSetOneForm
            cRef={cRef}
            form={form}
            initialValues={{...businessLicense, ...bankBindingInfo}}
          />
        ),
        showArrow: false,
        disabled: false,
      },
      {
        title: '银行卡信息',
        form: (
          <ActiveBankForm
            cRef={cRef}
            form={form}
            initialValues={{...businessLicense, ...bankBindingInfo}}
          />
        ),
        showArrow: false,
        disabled: false,
      },
      {
        title: '法人信息',
        form: (
          <LegalByOneForm
            cRef={cRef}
            form={form}
            initialValues={{...businessLicense, ...bankBindingInfo}}
          />
        ),
        showArrow: false,
        disabled: true,
      },
    ]

  }[bankAccount]
  const fetchAddCard = (callback) => {
    if (bankAccount === '1') {
      form.validateFields().then((val) => {
        let city = cRef.current.getCity();
        const {activeBeginDate, activeValidity} = val;
        let startDate = TIME_YMD(activeBeginDate[0]);
        let legalCertIdExpires = TIME_YMD(activeBeginDate[1]);
        let establishDate = TIME_YMD(activeValidity[0]);
        let validityPeriod = TIME_YMD(activeValidity[1]);
        let obj = {
          ...businessLicense,
          ...bankBindingInfo,
          ...val,
          ...city,
        };
        const {
          businessLicenseImg,
          businessName,
          businessScope,
          signInAddress,
          socialCreditCode,
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
          bankSwiftCode
        } = obj;
        dispatch({
          type: 'groupSet/fetchMerchantBank',
          payload: {
            merchantGroupId,
            bankAccountType: bankAccount,
            businessLicenseObject: {
              businessLicenseImg,
              businessName,
              businessScope,
              signInAddress,
              socialCreditCode,
              validityPeriod,
              establishDate
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
              cardName,
              bankSwiftCode,
              startDate: startDate.replace(/-/g, ''),
              legalCertIdExpires: legalCertIdExpires.replace(/-/g, ''),
              legalCertId,
            },
          },
          callback: callback,
        });
      });
    } else {
      form.validateFields().then((val) => {
        let city = cRef.current.getCityByOne();
        const {activeBeginDate, activeValidity} = val;
        let startDate = TIME_YMD(activeBeginDate[0]);
        let legalCertIdExpires = TIME_YMD(activeBeginDate[1]);
        let establishDate = TIME_YMD(activeValidity[0]);
        let validityPeriod = TIME_YMD(activeValidity[1]);
        let obj = {
          ...val,
          ...city,
        };
        const {
          businessLicenseImg,
          businessName,
          businessScope,
          signInAddress,
          socialCreditCode,
          bankPhoto,
          bankBranchName,
          provCode,
          areaCode,
          legalPerson,
          legalMp,
          cardNo,
          certFrontPhoto,
          certReversePhoto,
          legalCertId,
          bankSwiftCode
        } = obj;
        dispatch({
          type: 'groupSet/fetchMerchantBank',
          payload: {
            merchantGroupId,
            bankAccountType: bankAccount,
            businessLicenseObject: {
              businessLicenseImg,
              businessName,
              businessScope,
              signInAddress,
              socialCreditCode,
              validityPeriod,
              establishDate
            },
            bankBindingObject: {
              bankPhoto,
              cardNo,
              bankBranchName,
              provCode,
              areaCode,
              legalMp,
              legalPerson,
              legalCertId,
              legalCertIdExpires,
              startDate,
              certFrontPhoto,
              certReversePhoto,
              bankSwiftCode
            },
          },
          callback: callback,
        });
      })
    }

  };
  return (
    <>
      <Drawer
        title={`激活账户信息`}
        width={660}
        visible={visible1}
        destroyOnClose={true}
        onClose={onClose}
        bodyStyle={{paddingBottom: 80}}
        footer={
          <div style={{textAlign: 'right'}}>
            <Space>
              <Button onClick={() => saveVisible({
                visible1: false,
                merchantGroupId: null,
                groupDetails: {},
                merchantGroupDTO: {},
                businessLicense: {},
                bankBindingInfo: {},
              })}>取消</Button>
              <Button
                loading={loading}
                onClick={() =>
                  fetchAddCard(() => {
                    childRef.current.fetchGetData();
                    saveVisible(
                      {
                        visible1: false,
                        merchantGroupId: null,
                        groupDetails: {},
                        merchantGroupDTO: {},
                        businessLicense: {},
                        bankBindingInfo: {},
                      });
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
        <Radio.Group
          style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}
          options={options}
          onChange={(e) => {
            setBankAccount(e.target.value)
          }} value={bankAccount}/>
        <Title panelList={panelList}></Title>
      </Drawer>
    </>
  );
};

export default connect(({groupSet, loading}) => ({
  ...groupSet,
  loading: loading.effects['groupSet/fetchMerchantBank'],
}))(addGroups);
