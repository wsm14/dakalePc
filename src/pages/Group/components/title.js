import React from 'react'
import style from './../style.less'
import {Collapse} from 'antd';
const {Panel} = Collapse;

export default ({panelList = []}) => {
  return (
    <Collapse defaultActiveKey={['基础信息','品牌信息','登录信息','联系人信息','店铺信息','对公账户信息','法人信息']}>
      {panelList.map(item => {
        const {title='',extra='', form='',showArrow = true, disabled = false} = item;
        return (
          <Panel header={title} extra={extra} key={title}  disabled = {disabled} showArrow={showArrow}>
            {form}
          </Panel>
        )
      })}

    </Collapse>
  )
}
