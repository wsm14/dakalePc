import React, {useState, useRef} from "react";
import {Button, Drawer, Space, Form, notification} from "antd";
import FormCondition from "@/components/FormCondition";
import Title from './title'
import BaseForm from './Form/BaseForm'
import ManagementForm from './Form/ManagementForm'
import UserForm from './Form/userForm'
import UserDetailsForm from './Form/userDetailsForm'
import ShopDetailsForm from './Form/shopDetailsForm'
import {connect} from 'umi'
import aliOssUpload from '@/utils/aliOssUpload';

const addGroups = (props) => {
  const {
    onClose,
    fetchUpData,
    visible = false,
    dispatch,
    saveVisible
  } = props
  const [form] = Form.useForm()
  const cRef = useRef()
  const cRef1 = useRef()
  const fetchGetList = () => {
    dispatch({
      type: 'groupSet/fetchGetList'
    })

  }
  const panelList = [{
    title: '基础信息',
    form: <BaseForm cRef={cRef} form={form} initialValues={initialValues}/>,
    showArrow: false,
    disabled: true
  }, {
    title: '品牌信息',
    form: <ManagementForm form={form} initialValues={initialValues}/>,
  }, {
    title: '登录信息',
    form: <UserForm cRef={cRef1} form={form} initialValues={initialValues}/>,
    showArrow: false,
    disabled: true,

  }, {
    title: '联系人信息',
    form: <UserDetailsForm form={form} initialValues={initialValues}/>,
    showArrow: false,
    disabled: true
  }, {
    title: '店铺信息',
    form: <ShopDetailsForm form={form} initialValues={initialValues}/>,
    extra: '(上传后可同步至旗下子商户)'
  }]

  const fetchAddLists = (callback) => {
    const roleIds = cRef1.current.getRoleIds()
    form.validateFields().then(async (val) => {
      const payload = cRef.current.fetchAllData()

      const {lat, lnt} = payload
      if (!lat && !lnt) {
        return notification.error({
          message: '请点击查询!设置经纬度'
        })
      } else {
        let {brandLogo, localImages, mainImages} = val
        brandLogo = await aliOssUpload(brandLogo)
        localImages = await aliOssUpload(localImages)
        mainImages = await aliOssUpload(mainImages)
        dispatch({
          type: 'groupSet/fetchAddList',
          payload: {
            ...val, ...payload,
            brandLogo: brandLogo.toString(),
            localImages: localImages.toString(),
            mainImages: mainImages.toString(),
            ...roleIds
          },
          callback:() => callback()
        });
      }
    })
  }
  const initialValues = useState({})
  return (
    <>
      <Drawer
        title={`新增集团`}
        width={850}
        visible={visible}
        destroyOnClose={true}
        afterVisibleChange={() => {

        }}
        onClose={onClose}
        bodyStyle={{paddingBottom: 80}}
        footer={
          <div style={{textAlign: 'right'}}>
            <Space>
              <Button onClick={() => fetchAddLists(() => saveVisible({visible:false}))}>保存</Button>
              <Button onClick={() => fetchAddLists(() => saveVisible({visible:false,visible1:true}))} type="primary">
                下一步
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

export default connect(({sysTradeList, groupSet, loading}) => ({
  ...sysTradeList,
  ...groupSet,
  loading: loading.effects['circleMaster/fetchMasterTotal'],
}))(addGroups)
