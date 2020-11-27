import React, {useState, useRef} from "react";
import {Button, Drawer, Space, Form, notification, Card} from "antd";
import Title from './title'
import {connect} from 'umi'

const addGroups = (props) => {
  const {
    dispatch,
    visible2,
    onClose,
    panelList
  } = props
  const tabList = [
    {
      key: 'tab1',
      tab: '集团信息',
    },
    {
      key: 'tab2',
      tab: '账户信息',
    },
  ];
  return (
    <>
      <Drawer
        title={`集团详情`}
        width={660}
        visible={visible2}
        destroyOnClose={true}
        afterVisibleChange={() => {

        }}
        onClose={onClose}
        bodyStyle={{paddingBottom: 80}}
        footer={
          <div style={{textAlign: 'right'}}>
            <Space>
              <Button onClick={() => {}}>取消</Button>
              <Button onClick={() => {}} type="primary">
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
