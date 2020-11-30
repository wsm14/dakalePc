import React, {useState, useRef} from "react";
import {PHONE_PATTERN, SPACE_PATTERN, WORD_NUM_PATTERN} from "@/common/regExp";
import {Spin, Transfer} from "antd";
import {SEX_TYPE, TIME_YMD} from "@/common/constant";
import aliOssUpload from "@/utils/aliOssUpload";
import cityList from "@/common/city";
import moment from "moment";


export const base = [{
  label: '集团名称',
  name: 'groupName',
}, {
  label: '经营类目',
  type: 'cascader',
  name: 'topCategoryName',
}, {
  label: '详细地址',
  name: 'address',
}, {
  label: '服务费比例',
  name: 'commissionRatio',
}]
export const user = [{label: '登录账号', name: 'account',}]
// {
//   label: '角色',
//   name: 'idString',
//   type: 'childrenOwn',
//   rules: [{ required: false }],
//   childrenOwn: (
//     <Spin spinning={loading}>
//       <Transfer
//         showSearch
//         targetKeys={roleIds}
//         dataSource={rolesList}
//         onChange={setRoleIds}
//         titles={['可选', '已选']}
//         operations={['添加', '删除']}
//         render={(item) => item.title}
//         listStyle={{
//           width: 250,
//           height: 300,
//         }}
//       />
//     </Spin>
//   ),
// },

export const userDetails = [
  {
    label: '联系人姓名',
    name: 'contactPerson',
  },
  {
    label: '联系人电话',
    name: 'contactMobile',
  },
]

export const shopDetails = [{
  label: '店铺主图',
  name: 'mainImages',
  type: 'upload',
},
  {
    label: '店铺小图',
    name: 'localImages',
    type: 'upload',
  },
  {
    label: '店铺介绍',
    name: 'groupDesc',
    type: 'textArea',
  },]

export const active = [
  {
    label: '营业执照',
    name: 'businessLicenseImg',
    type: 'upload',
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
    name: 'validityPeriod',
  },
  {
    label: '经营范围',
    name: 'businessScope',
    type: 'textArea',
    // rules: [{ required: true, message: `请确认店铺门头照` }],
  },
  {
    label: '开户许可证',
    name: 'openAccountPermit',
    type: 'upload',
    maxFile: 1,
  },
  {
    label: '开户名称',
    name: 'cardName',

  },
  {
    label: '银行卡号',
    name: 'cardNo',

  },
  {
    label: '开户银行',
    name: 'bankBranchName',
    // addRules: [{ pattern: PHONE_PATTERN, message: '注册帐号为手机号，手机号不正确' }],
  },
  // {
  //   label: '开户支行',
  //   name: '',
  //   // type: 'select',
  //   // onSearch: vale => console.log(vale),
  //   // select:
  // },
]
export const legal = [
  {
    label: '法人身份证正面照',
    name: 'certFrontPhoto',
    type: 'upload',
  },
  {
    label: '法人身份证反面照',
    name: 'certReversePhoto',
    type: 'upload',
  },
  {
    label: '法人姓名',
    name: 'legalPerson',
  },
  {
    label: '法人身份证号码',
    name: 'legalCertId',
  },
  {
    label: '法人身份有效期',
    name: 'activeBeginDate',
  },
  {
    label: '法人手机号',
    name: 'legalMp',
  },
]

export const management = [
  {
    label: '品牌',
    name: 'brandId',
  },
  {
    label: '品牌LOGO',
    name: 'brandLogo',
    type: 'upload',
  },
]

