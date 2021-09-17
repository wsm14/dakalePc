import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Tabs, Alert, Form, notification } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import DrawerCondition from '@/components/DrawerCondition';
import CheckRecord from '@/components/CheckRecord';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';
import CheckRefuseDraw from './Detail/CheckRefuseDraw';
import DetailForm from './Detail/DetailForm';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const VideoCheck = (props) => {
  const { visible, onClose, total, getDetail, loading, dispatch, tabkey, cRef } = props;
  const {
    show = false,
    index,
    detail = {},
    status,
    ownerIdString,
    auditIdString,
    submitterType,
  } = visible;
  console.log(status, 'ssss');
  // status0-待审核 1-已通过 2-已驳回 3-已关闭

  const [visibleRefuse, setVisibleRefuse] = useState(false);
  const [recordList, setRecordList] = useState({});
  const { divisionFlag } = detail;

  // 0-待审核 1-已通过 2-已驳回 3-已关闭

  // 审核通过
  const handleVerifyAllow = () => {
    const payload = {
      submitterType,
      auditId: auditIdString,
      ownerId: ownerIdString,
    };
    dispatch({
      type: 'specialGoodsCheck/fetchSpecialGoodsAudit',
      payload: payload,
      callback: () => {
        onClose();
        cRef.current.fetchGetData();
      },
    });
  };

  const btnList = [
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      text: '审核通过',
      show: ['0'].includes(status) && ['adminAudit'].includes(tabkey),
    },
  ];
  // 弹出窗属性
  const modalProps = {
    title: '活动详情',
    visible: show,
    loading,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: (
      <ExtraButton list={btnList}>
        {['0'].includes(status) && ['adminAudit'].includes(tabkey) && (
          <Button
            style={{ marginLeft: 8 }}
            danger
            onClick={() =>
              setVisibleRefuse({
                show: true,
                type: 'edit',
                auditId: auditIdString,
                ownerId: ownerIdString,
              })
            }
          >
            审核驳回
          </Button>
        )}
      </ExtraButton>
    ),
  };

  //审核记录
  const handleTabChange = (val) => {
    if (val === '3') {
      setRecordList([]);
      if (detail.marketingIdString) {
        dispatch({
          type: 'baseData/fetchGetLogDetail',
          payload: {
            type: 'audit',
            key: 'audit',
            identificationId: detail.marketingIdString,
          },
          callback: (list) => {
            setRecordList(list);
          },
        });
      } else {
        notification.info({
          message: '温馨提示',
          description: '暂无审核记录',
        });
      }
    }
  };

  return (
    <DrawerCondition {...modalProps}>
      {/* 驳回原因 */}
      {status == '2' && (
        <Alert
          message={`驳回原因：${
            detail.rejectReason.length > 12
              ? detail.rejectReason.substr(0, 12) + '...'
              : detail.rejectReason
          }`}
          type="error"
          banner
          action={
            <Button
              size="small"
              danger
              onClick={() =>
                setVisibleRefuse({
                  show: true,
                  type: 'info',
                  detail: {
                    rejectReason: detail.rejectReason,
                    rejectImg: detail.rejectImg || '',
                  },
                })
              }
            >
              <DoubleRightOutlined />
            </Button>
          }
        />
      )}
      {/* 信息展示 */}
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <Tabs.TabPane tab="分享信息" key="1">
          <DetailForm detail={detail} tabkey={tabkey}></DetailForm>
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="审核记录" key="2">
          <CheckRecord recordList={recordList}></CheckRecord>
        </Tabs.TabPane> */}
      </Tabs>
      <CheckRefuseDraw
        cRef={cRef}
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse(false)}
        onCloseF={onClose}
      ></CheckRefuseDraw>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoodsCheck/fetchSpecialGoodsAuditDetail'],
}))(VideoCheck);
