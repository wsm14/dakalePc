import React, {useState, useImperativeHandle} from "react";
import {connect} from 'umi'
import FormCondition from "@/components/FormCondition";
import aliOssUpload from '@/utils/aliOssUpload';
import {TIME_YMD} from "@/common/constant"
import moment from "moment";

const activeForm = ({ form, initialValues, dispatch, cRef}) => {
  const fetchGetOcrBusinessLicense = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrBusinessLicense',
      payload: payload,
      callback: (val) => callback(val)
    })
  }
  const fetchGetOcrBankLicense = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrBankLicense',
      payload: payload,
      callback: (val) => callback(val)
    })
  }
  const [city, setCity] = useState({})

  const formItems = [
    {
      label: '营业执照',
      name: 'businessLicenseImg',
      type: 'upload',
      maxSize: 1,
      maxFile: 1,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val)
        if (imgUrl) {
          form.setFieldsValue({
            businessLicenseImg: imgUrl[0]
          })
          fetchGetOcrBusinessLicense({imageUrl: imgUrl[0]}, res => {
            const {address, business, establishDate, name, regNum, validPeriod} = res
            form.setFieldsValue({
              socialCreditCode: regNum || '',
              businessName: name || '',
              signInAddress: address || '',
              activeValidity: [moment(establishDate, 'YYYY-MM-DD'), moment(validPeriod, 'YYYY-MM-DD')],
              businessScope: business || '',
            })
          })
        }
      }
    },
    {
      label: '社会信用代码',
      name: 'socialCreditCode',
    },
    {
      label: '公司名称',
      name: 'businessName',
    },
    {
      label: '注册地址',
      name: 'signInAddress',
    },
    {
      label: '营业期限',
      type: 'rangePicker',
      name: 'activeValidity',
      // disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '经营范围',
      name: 'businessScope',
      type: 'textArea',
      // rules: [{ required: true, message: `请确认店铺门头照` }],
    },
  ];


  return (
    <FormCondition formItems={formItems} form={form} initialValues={initialValues}/>
  )
}

export default connect(({groupSet}) => ({
  ...groupSet
}))(activeForm)

