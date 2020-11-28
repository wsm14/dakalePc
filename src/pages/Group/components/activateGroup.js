import React, {useState, useRef, useEffect} from "react";
import {Button, Drawer, Space, Form, notification} from "antd";
import FormCondition from "@/components/FormCondition";
import Title from './title'
import ActiveSetForm from './Form/activeSetForm'
import LegalForm from './Form/LegalForm'
import {connect} from 'umi'
import {TIME_YMD} from '@/common/constant'
import aliOssUpload from '@/utils/aliOssUpload';
import moment from "moment";
const addGroups = (props) => {
  const {
    onClose,
    fetchUpData,
    visible = false,
    dispatch,
    visible1,
    saveVisible,
    merchantGroupId,
    groupDetails
  } = props
  const [initialValues,setInitialValues] = useState({})
  useEffect(() => {
    const{businessLicense,bankBindingInfo} = groupDetails
    if(businessLicense && bankBindingInfo) {
      setInitialValues({
        ...businessLicense,
        ...bankBindingInfo,
        activeBeginDate:[moment(bankBindingInfo.startDate),moment(bankBindingInfo.legalCertIdExpires)]
      })
    }
  },[groupDetails])

  const [form] = Form.useForm()
  const cRef = useRef()
  const fetchGetList = () => {
    dispatch({
      type: 'groupSet/fetchGetList'
    })
  }
  const panelList = [{
    title: '对公账户信息',
    form: <ActiveSetForm cRef={cRef} form={form} initialValues={initialValues}/>,
    showArrow: false,
    disabled: true
  },{
    title: '法人信息',
    form: <LegalForm cRef={cRef} form={form} initialValues={initialValues}/>,
    showArrow: false,
    disabled: true
  }]

  const fetchAddCard = (callback) => {

    form.validateFields().then(val => {
      let city = cRef.current.getCity()
       const {activeBeginDate } = val
       let startDate = TIME_YMD(activeBeginDate[0]);
       let legalCertIdExpires = TIME_YMD(activeBeginDate[1])
       let obj =  {
         ...val,
       }
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
         legalCertId
       } = obj
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
            validityPeriod
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
            startDate:startDate.replace(/-/g, ''),
            legalCertIdExpires:legalCertIdExpires.replace(/-/g, ''),
            legalCertId
          }
        },
        callback: callback
      })
    })

  }
  return (
    <>
      <Drawer
        title={`激活账户信息`}
        width={660}
        visible={visible1}
        destroyOnClose={true}
        afterVisibleChange={(visible) => {
          if(!visible){
            saveVisible({
              groupDetails: {}
            })
          }
        }}
        onClose={onClose}
        bodyStyle={{paddingBottom: 80}}
        footer={
          <div style={{textAlign: 'right'}}>
            <Space>
              <Button onClick={() => saveVisible({visible1: false})}>取消</Button>
              <Button onClick={() => fetchAddCard(() => saveVisible({visible1: false}))} type="primary">
                  保存
              </Button>
            </Space>
          </div>
        }
      >
        <Title panelList={panelList}></Title>
      </Drawer>
    </>
  )
}

export default connect(({ groupSet, loading}) => ({
  ...groupSet,
}))(addGroups)
