import React, {useState, useRef} from "react";
import {Button, Drawer, Space, Form, notification, Card, message} from "antd";
import Title from './title'
import {connect} from 'umi'
import DescriptionsCondition from '@/components/DescriptionsCondition';
import {
  base, user, userDetails, shopDetails, active, legal, management
} from './details/detailsIndex'

const groupsDetails = (props) => {
  const {
    dispatch,
    visible2,
    onClose,
    merchantGroupId,
    groupDetails,
    saveVisible
  } = props
  const fetchGrounpDetails = () => {
    if (merchantGroupId) {
      dispatch({
        type: 'groupSet/fetchGrounpDetails',
        payload: {
          merchantGroupId,
        }
      })
    } else message.error({
      content: '参数错误'
    })
  }

  let tabList = [
    {
      key: 'tab1',
      tab: '集团信息',
    },
  ];
  if (groupDetails.merchantGroupDTO && groupDetails.merchantGroupDTO.bankStatus !== '0') {
    tabList = [
      {
        key: 'tab1',
        tab: '集团信息',
      },
      {
        key: 'tab2',
        tab: '账户信息',
      },
    ];
  }
  const {
    businessLicense,
    bankBindingInfo,
    merchantGroupDTO
  } = groupDetails
  const [tabKey, setTabKey] = useState('tab1')
  const btnShow = () => {
    if(tabKey==='tab2'
      && groupDetails.merchantGroupDTO
      && (groupDetails.merchantGroupDTO.bankStatus === '3'
      || groupDetails.merchantGroupDTO.bankStatus === '1')){
        return false
    }
    return  true
  }
  const fetchGrounpGoBtn = () => {
    if (tabKey === 'tab1') {
      saveVisible({
        visible2: false,
        visible: true,
      })
    } else {
      saveVisible({
        visible2: false,
        visible1: true,
      })
    }
  }
  const panelList = {
    tab1: [{
      title: '基础信息',
      form: <DescriptionsCondition formItems={base} initialValues={{...merchantGroupDTO}}></DescriptionsCondition>,
      showArrow: false,
      disabled: true
    }, {
      title: '品牌信息',
      form: <DescriptionsCondition formItems={management}
                                   initialValues={{...merchantGroupDTO}}></DescriptionsCondition>,
    }, {
      title: '登录信息',
      form: <DescriptionsCondition formItems={user} initialValues={{...merchantGroupDTO}}></DescriptionsCondition>,
      showArrow: false,
      disabled: true,

    }, {
      title: '联系人信息',
      form: <DescriptionsCondition formItems={userDetails}
                                   initialValues={{...merchantGroupDTO}}></DescriptionsCondition>,
      showArrow: false,
      disabled: true
    }, {
      title: '店铺信息',
      form: <DescriptionsCondition formItems={shopDetails}
                                   initialValues={{...merchantGroupDTO}}></DescriptionsCondition>,
      extra: '(上传后可同步至旗下子商户)'
    }],
    tab2: [{
      title: '对公账户信息',
      form: <DescriptionsCondition formItems={active} initialValues={{
        ...businessLicense,
        ...bankBindingInfo,
      }}></DescriptionsCondition>,
      showArrow: false,
      disabled: true
    }, {
      title: '法人信息',
      form: <DescriptionsCondition formItems={legal} initialValues={{
        ...businessLicense, ...bankBindingInfo,
        activeBeginDate:(bankBindingInfo && bankBindingInfo.startDate || '') + '-'+ (bankBindingInfo && bankBindingInfo.legalCertIdExpires || '')
      }}></DescriptionsCondition>,
      showArrow: false,
      disabled: true
    }]
  }[tabKey]
  return (
    <>
      <Drawer
        title={`集团详情`}
        width={660}
        visible={visible2}
        destroyOnClose={true}
        afterVisibleChange={(visible) => {
          if (visible) {
            fetchGrounpDetails()
          }
        }}
        onClose={onClose}
        bodyStyle={{paddingBottom: 80}}
        footer={

          btnShow() &&
          <div style={{textAlign: 'right'}}>
            <Space>
              <Button onClick={() => {
                saveVisible({
                  visible2: false,
                  merchantGroupId: null,
                  groupDetails: {},
                  merchantGroupDTO: {},
                  businessLicense: {},
                  bankBindingInfo: {},
                })
              }}>取消</Button>
              <Button onClick={() => fetchGrounpGoBtn()} type="primary">
                去修改
              </Button>
            </Space>
          </div>

        }
      >
        <Card
          bordered={false}
          tabList={tabList}
          activeTabKey={tabKey}
          onTabChange={(key) => setTabKey(key)}
        >
          <Title panelList={panelList}></Title>
        </Card>
      </Drawer>
    </>
  )
}

export default connect(({groupSet, loading}) => ({
  ...groupSet,
}))(groupsDetails)
