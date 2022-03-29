import React, { useState } from 'react';
import connect from 'umi';
import { Button } from 'antd';
import { VERIFY_STATUS_DOT, HITTING_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import ExtraButton from '@/components/ExtraButton';
import CheckRefuseDraw from './CheckRefuseDraw';
import RelevanceDot from './Form/RelevanceDot';

const PointCheckDetail = (props) => {
  const { visible = {}, onClose, childRef, total, getDetail } = props;
  const { show = false, type, detail = {}, index } = visible;

  const { hittingAuditId } = detail;

  const [visibleRefuse, setVisibleRefuse] = useState(false);
  const [visibleDot, setVisibleDot] = useState(false); //关联点位

  //关联点位
  const handleVerifyAllow = () => {
    setVisibleDot({
      show: true,
      hittingAuditId,
      initialValues: detail,
    });
  };

  const formItems = [
    {
      label: `${detail.verifyStatus != '1' ? '审核ID' : '点位ID'}`,
      name: `${detail.verifyStatus != '1' ? 'hittingAuditId' : 'hittingId'}`,
    },
    {
      label: '点位名称',
      name: 'hittingName',
    },
    {
      label: '归属人姓名',
      name: 'submitterName',
    },
    {
      label: '归属人手机号',
      name: 'mobile',
    },
    {
      label: '点位地址',
      name: 'address',
    },
    {
      label: '类型',
      name: 'hittingType',
      render: (val) => HITTING_TYPE[val],
    },
    {
      label: '申请原因',
      name: 'submitReason',
    },
    {
      label: '提交时间',
      name: 'createTime',
    },
  ];
  const userItems = [
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '注册手机号',
      name: 'userMobile',
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
    title: '点位信息',
    visible: show,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, type),
    },
    footer: type == 'check' && (
      <ExtraButton list={btnList}>
        <Button
          style={{ marginLeft: 8 }}
          danger
          onClick={() =>
            setVisibleRefuse({
              show: true,
              type: 'edit',
              hittingAuditId, //审核Id
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
        onCloseF={onClose}
      ></RelevanceDot>
    </>
  );
};
export default PointCheckDetail;
