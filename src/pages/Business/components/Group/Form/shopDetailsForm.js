import React, {useState} from "react";
import {connect} from 'umi'
import {message, Button} from "antd";
import FormCondition from "@/components/FormCondition";
import {AMAP_KEY} from "@/common/constant";
import {Map, Marker} from "react-amap";

const ManagementForm = (props) => {
  const {
    list,
    form,
    initialValues
  } = props

  const formItems = [
    {
      label: '店铺主图',
      name: 'mainImages',
      type: 'upload',
      multiple:true,
      rules: [{ required: false }],
      maxFile: 5,
      // addRules: [
      //   {
      //     validator: (rule, value) => {
      //       if (typeof value === 'string') {
      //         return Promise.resolve();
      //       }
      //       if (!value) {
      //         return Promise.resolve();
      //       }
      //       const { fileList } = value;
      //       if (fileList.length < 3) {
      //         return Promise.reject('至少上传 3 张图');
      //       }
      //       return Promise.resolve();
      //     },
      //   },
      // ],
      extra: '店铺主图最多可上传5张',
    },
    {
      label: '店铺小图',
      name: 'localImages',
      type: 'upload',
      multiple:true,
      maxFile: 9,
      extra: '店铺小图最多可上传9张',
      rules: [{ required: false }],
    },
    {
      label: '店铺介绍',
      name: 'groupDesc',
      type: 'textArea',
      maxLength: 200,
      rules: [{ required: false }],
      // rules: [{ required: true, message: `请确认店铺门头照` }],
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
