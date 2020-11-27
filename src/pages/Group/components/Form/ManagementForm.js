import React, {useState} from "react";
import {connect} from 'umi'
import FormCondition from "@/components/FormCondition";


const ManagementForm = (props) => {
  const {
    list,
    form,
    initialValues,
  } = props

  const formItems = [
    {
      label: '品牌',
      name: 'brandId',
      type: 'select',
      select: list.map((item) => ({name: item.brandName, value: item.configBrandIdString}))
      // loading,
      // labelInValue: true,
      // visible: !userInfo.roleId,
      // select: selectValue.map((item) => ({ name: item.value, value: item.child })),
    },
    {
      label: '品牌LOGO',
      name: 'brandLogo',
      type: 'upload',
      maxFile: 1,
      extra: '最多上传 1 张图片，建议尺寸1080px*720px，支持JPG、PNG、JPEG格式，大小在2M以内',
    },
  ];


  return (
    <FormCondition formItems={formItems} form={form} initialValues={initialValues}/>
  )
}

export default connect(({businessBrand}) => ({
  list: businessBrand.list,
  ...businessBrand
}))(ManagementForm)
