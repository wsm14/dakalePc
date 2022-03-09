import React, { useState } from 'react';
import connect from 'umi';
import { Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import ExtraButton from '@/components/ExtraButton';
import CheckRefuseDraw from './CheckRefuseDraw';
import RelevanceDot from './Form/RelevanceDot';

const PointCheckDetail = (props) => {
  const { visible = {}, onClose, total, getDetail, childRef } = props;
  const { show = false, type, index, detail = {} } = visible;

  const [visibleRefuse, setVisibleRefuse] = useState(false);
  const [visibleDot, setVisibleDot] = useState(false); //关联点位

  //关联点位
  const handleVerifyAllow = () => {
    setVisibleDot({
      show: true,
    });
  };

  const formItems = [
    {
      label: '点位ID',
      name: 'couponDescString',
    },
    {
      label: '点位名称',
      name: 'couponDescString',
    },
    {
      label: '归属人姓名',
      name: 'couponDescString',
    },
    {
      label: '归属人手机号',
      name: 'couponDescString',
    },
    {
      label: '点位地址',
      name: 'couponDescString',
    },
    {
      label: '类型',
      name: 'couponDescString',
    },
    {
      label: '申请原因',
      name: 'couponDescString',
    },
    {
      label: '提交时间',
      name: 'couponDescString',
    },
  ];
  const userItems = [
    {
      label: '用户昵称',
      name: 'couponDescString',
    },
    {
      label: '注册手机号',
      name: 'couponDescString',
    },
  ];
  const btnList = [
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      text: '关联点位',
    },
  ];

  const modalProps = {
    title: '审核详情',
    visible: true,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: (
      <ExtraButton list={btnList}>
        <Button
          style={{ marginLeft: 8 }}
          danger
          onClick={() =>
            setVisibleRefuse({
              show: true,
              type: 'edit',
            })
          }
        >
          驳回
        </Button>
      </ExtraButton>
    ),
  };
  return (
    <>
      <DrawerCondition {...modalProps}>
        <DescriptionsCondition
          title="点位信息"
          formItems={formItems}
          initialValues={detail}
        ></DescriptionsCondition>
        <DescriptionsCondition
          title="用户信息"
          formItems={userItems}
          initialValues={detail}
        ></DescriptionsCondition>
      </DrawerCondition>
      {/* 驳回 */}
      <CheckRefuseDraw
        cRef={childRef}
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse(false)}
        onCloseF={onClose}
      ></CheckRefuseDraw>
      {/* 关联点位 */}
      <RelevanceDot
        cRef={childRef}
        visible={visibleDot}
        onClose={() => setVisibleDot(false)}
      ></RelevanceDot>
    </>
  );
};
export default PointCheckDetail;
