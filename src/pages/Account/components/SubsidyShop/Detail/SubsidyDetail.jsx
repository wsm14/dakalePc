import React, {useState} from 'react';
import { connect } from 'umi';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SubsidyDetail = (props) => {
    const { dispatch, onClose, visible} = props

    const {type, show = false, info} = visible

    const formItems = [
        {
            label:"任务名称",
            nane:'taskName'
        },
        {
            label:"补贴类型",
            nane:'identificationType',
            render:(val)=>val==="platform"?"平台直充":'--'
        },
        {
            label:"补贴角色",
            nane:'subsidyRole',
            render:(val) => ({user :'用户',merchant:'商家'}[val])
        },
        // {
        //     label:"总参与人数",
        //     nane:'taskName'
        // },
        {
            label:"已补贴卡豆数",
            nane:'bean'
        },
        // {
        //     label:"充值卡豆数",
        //     nane:'taskName'
        // },
        {
            label:"状态",
            nane:'status',
            render:(val)=>"启用"
        },
    ]

    const modalProps = {
        title:"查看详情",
        visible:show,
        onClose,
    }

    return (
        <DrawerCondition {...modalProps}>
          <DescriptionsCondition formItems={formItems} initialValues={info}></DescriptionsCondition>
      </DrawerCondition>
    )


};
export default SubsidyDetail;
