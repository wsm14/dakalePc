import React, {useState, useRef, useEffect} from "react";
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
    visible = false,
    dispatch,
    saveVisible,
    groupDetails
  } = props
  const [form] = Form.useForm()
  const cRef = useRef()
  const cRef1 = useRef()
  const [initialValues,setInitialValues] = useState({})
  const [bottomBtn,setBottom] = useState('add')
  const fetchGetList = () => {
    dispatch({
      type: 'groupSet/fetchGetList',
      payload: {
        page:1,
        limit: 10,
      }
    })
  }

  useEffect(() => {
    const{merchantGroupDTO} = groupDetails
    if(merchantGroupDTO) {
      const {categoryNode} = merchantGroupDTO
      merchantGroupDTO.topCategSelect = categoryNode.split('.')
      setInitialValues(merchantGroupDTO)
      setBottom('update')
    }
    else {
      setBottom('add')
    }

  },[groupDetails])

  const Btn = {
    add: ( <div style={{textAlign: 'right'}}>
      <Space>
        <Button onClick={() => fetchAddLists(() => {
          saveVisible({visible:false});
          fetchGetList();
        })}>保存</Button>
        <Button onClick={() => fetchAddLists(() => saveVisible({visible:false,visible1:true}))} type="primary">
          下一步
        </Button>
      </Space>
    </div>),
    update: (<div style={{textAlign: 'right'}}>
      <Space>
        <Button onClick={() => saveVisible({visible:false})}>取消</Button>
        <Button onClick={() => fetchUpdateGroup(() =>{
          saveVisible({visible:false});
          fetchGetList()
        })} type="primary">
          保存
        </Button>
      </Space>
    </div>)
  }[bottomBtn]
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
    // const roleIds = cRef1.current.getRoleIds()
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
            // ...roleIds
          },
          callback:() => callback()
        });
      }
    })
  }
  const fetchUpdateGroup = (callback) => {
    form.validateFields().then(async (val) => {
      const payload = cRef.current.fetchAllData()
        let {brandLogo, localImages, mainImages} = val
        brandLogo = await aliOssUpload(brandLogo)
        localImages = await aliOssUpload(localImages)
        mainImages = await aliOssUpload(mainImages)
        dispatch({
          type: 'groupSet/fetchUpdateGroup',
          payload: {
            ...groupDetails.merchantGroupDTO,
            ...val, ...payload,
            brandLogo: brandLogo.toString(),
            localImages: localImages.toString(),
            mainImages: mainImages.toString(),
          },
          callback:() => callback()
        });
    })
  }
  return (
    <>
      <Drawer
        title={Object.keys(groupDetails).length> 0 ?'修改集团信息':`新增集团`}
        width={850}
        visible={visible}
        destroyOnClose={true}
        afterVisibleChange={(visible) => {
          console.log(visible)
          if(!visible){
            saveVisible({groupDetails:{}})}
        }}
        onClose={onClose}
        bodyStyle={{paddingBottom: 80}}
        footer={
          Btn
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
