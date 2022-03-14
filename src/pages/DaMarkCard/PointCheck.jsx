import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import { checkCityName } from '@/utils/utils';
import { VERIFY_STATUS_DOT, HITTING_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PointCheckDetail from './components/PointCheck/PointCheckDetail';

const PointCheck = (props) => {
  const { pointCheck, loading, dispatch } = props;
  console.log(pointCheck, 'pointCheck');
  const [visible, setVisible] = useState(false);

  const tabList = [
    {
      key: '0',
      tab: '待审核',
    },
    {
      key: '1',
      tab: '已审核',
    },
  ];

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0');

  const searchItems = [
    {
      label: '点位名称',
      name: 'hittingName',
    },
    {
      label: '归属人手机号',
      name: 'mobile',
    },
    {
      label: '审核类型',
      name: 'verifyStatus',
      type: 'select',
      select: VERIFY_STATUS_DOT,
    },
    {
      label: '用户昵称',
      name: 'submitterName',
    },
    {
      label: '注册手机号',
      name: 'userMobile',
    },
    {
      label: '类型',
      name: 'hittingType',
      type: 'select',
      select: HITTING_TYPE,
    },
  ];

  const getColumns = [
    {
      title: '点位ID',
      fixed: 'left',
      dataIndex: 'hittingId',
      show: tabKey === '1',
    },
    {
      title: '点位名称',
      dataIndex: 'hittingName',
    },
    {
      title: '归属人姓名',
      dataIndex: 'submitterName',
    },
    {
      title: '归属人手机号',
      dataIndex: 'mobile',
    },
    {
      title: '点位地址',
      dataIndex: 'address',
    },
    {
      title: '类型',
      dataIndex: 'hittingType',
      render: (val) => HITTING_TYPE[val],
    },
    {
      title: '申请原因',
      dataIndex: 'submitReason',
    },
    {
      title: '用户昵称',
      dataIndex: 'username',
    },
    {
      title: '注册手机号',
      dataIndex: 'userMobile',
    },
    {
      title: '最新提交时间',
      dataIndex: 'createTime',
    },
    // {
    //   title: '审核类型',
    //   dataIndex: 'name',
    //   show: tabKey === '1',
    // },
    {
      title: '审核时间',
      dataIndex: 'name',
      show: tabKey === '1',
    },
    {
      title: '审核结果',
      dataIndex: 'verifyStatus',
      render: (val) => VERIFY_STATUS_DOT[val],
      show: tabKey === '1',
    },
    {
      title: '驳回原因',
      dataIndex: 'rejectReason',
      show: tabKey === '1',
    },
    {
      type: 'handle',
      dataIndex: 'hittingAuditId',
      render: (val, record, index) => {
        return [
          {
            type: 'check', //审核
            click: () => fetchcheckDetail(record, 'check'),
            visible: tabKey === '0',
          },
          {
            type: 'info',
            click: () => fetchcheckDetail(record, 'info'),
            visible: tabKey === '1',
          },
          // {
          //   type: 'close', //关闭
          //   pop: true,
          //   popText: '关闭则表示用户不再申请该点位，确定关闭吗',
          //   visible: tabKey === '1',
          // },
        ];
      },
    },
  ];

  //详情
  const fetchcheckDetail = (record, type) => {
    setVisible({
      type,
      show: true,
      detail: record,
    });
  };

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: (key) => {
            setTabKey(key);
            childRef.current.fetchGetData({verifyStatus: key, page: 1 });
          },
        }}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.hittingAuditId}`}
        dispatchType="pointCheck/fetchGetList"
        {...pointCheck}
      ></TableDataBlock>
      <PointCheckDetail
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></PointCheckDetail>
    </>
  );
};
export default connect(({ loading, pointCheck }) => ({
  pointCheck,
  loading: loading.models.pointCheck,
}))(PointCheck);
