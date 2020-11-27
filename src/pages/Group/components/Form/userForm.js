import React, {useImperativeHandle, useState} from "react";
import FormCondition from "@/components/FormCondition";
import {SPACE_PATTERN,WORD_NUM_PATTERN} from "@/common/regExp";
import {connect} from 'umi'
import {Spin, Transfer} from "antd";
const userForm = (props) => {
  const {
    form,
    initialValues,
    loading,
    rolesList,
    cRef
  } = props
  const [roleIds, setRoleIds] = useState([]);
  useImperativeHandle(cRef, () => ({
    getRoleIds: () => {
      return {roleIds}
    }
  }))

  const formItems = [
    {
      label: '登录账号',
      name: 'account',
      maxLength: 30,
      addRules: [{ pattern: !SPACE_PATTERN, message: '账号格式不正确' }],
    },
    {
      label: '角色',
      name: 'idString',
      type: 'childrenOwn',
      rules: [{ required: false }],
      childrenOwn: (
        <Spin spinning={loading}>
          <Transfer
            showSearch
            targetKeys={roleIds}
            dataSource={rolesList}
            onChange={setRoleIds}
            titles={['可选', '已选']}
            operations={['添加', '删除']}
            render={(item) => item.title}
            listStyle={{
              width: 250,
              height: 300,
            }}
          />
        </Spin>
      ),
    },
    {
      label: '登录密码',
      name: 'password',
      maxLength: 16,
      addRules: [{ pattern: WORD_NUM_PATTERN, message: '账号格式不正确' }],
    },
  ];


  return (
    <FormCondition formItems={formItems} form={form} initialValues={initialValues}/>
  )
}

export default  connect(({groupSet, loading}) => ({
  ...groupSet,
  loading: loading.models.groupSet
  // effects['groupSet/fetchGetOcrIdCardFront'],
}))(userForm)

