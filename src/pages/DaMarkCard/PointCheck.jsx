import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import Ellipsis from '@/components/Ellipsis';
import { checkCityName } from '@/utils/utils';
import { MARK_CARD_MAIN_TYPE, MARK_CARD_OPEN_STATE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PointCheckDetail from './components/PointCheck/PointCheckDetail';

const PointCheck = (props) => {
  const { pointManageList, loading, dispatch } = props;
  //   const { list = [] } = pointManageList;

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
      name: 'name',
    },
    {
      label: '归属人手机号',
      name: 'mobile',
    },
    {
      label: '审核类型',
      name: 'type',
      type: 'select',
    },
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '注册手机号',
      name: 'mobile',
    },
    {
      label: '类型',
      name: 'type',
      type: 'select',
    },
  ];
  const getColumns = [
    {
      title: '点位ID',
      fixed: 'left',
      dataIndex: 'hittingMainId',
      show: tabKey === '1',
    },
    {
      title: '点位名称',
      dataIndex: 'name',
    },
    {
      title: '归属人姓名',
      dataIndex: 'name',
    },
    {
      title: '归属人手机号',
      dataIndex: 'name',
    },
    {
      title: '点位地址',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'name',
    },
    {
      title: '申请原因',
      dataIndex: 'name',
    },
    {
      title: '用户昵称',
      dataIndex: 'name',
    },
    {
      title: '注册手机号',
      dataIndex: 'name',
    },
    {
      title: '最新提交时间',
      dataIndex: 'name',
    },
    {
      title: '审核类型',
      dataIndex: 'name',
      show: tabKey === '1',
    },
    {
      title: '审核时间',
      dataIndex: 'name',
      show: tabKey === '1',
    },
    {
      title: '审核结果',
      dataIndex: 'name',
      show: tabKey === '1',
    },
    {
      title: '驳回原因',
      dataIndex: 'name',
      show: tabKey === '1',
    },
    {
      type: 'handle',
      width: 150,
      dataIndex: 'hittingMainId',
      render: (val, record, index) => {
        return [
          {
            type: 'check', //审核
            click: () => fetchcheckDetail(index, 'check'),
          },
          {
            type: 'info',
            click: () => fetchcheckDetail(index, 'info'),
          },
          {
            type: 'checkDetail',//审核记录
          },
          {
            type: 'close',//关闭
            pop: true,
            popText:'关闭则表示用户不再申请该点位，确定关闭吗'
          },
        ];
      },
    },
  ];

  const fetchcheckDetail = (index, type) => {
    // const { ids } = list[index];
    setVisible({
      type,
      show: true,
      index,
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
          onTabChange: setTabKey,
        }}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.hittingMainId}`}
        // dispatchType="pointManage/fetchGetList"
        // {...pointManageList}
      ></TableDataBlock>
      <PointCheckDetail
        childRef={childRef}
        getDetail={fetchcheckDetail}
        total={2}
        visible={visible}
        onClose={() => setVisible(false)}
      ></PointCheckDetail>
    </>
  );
};
export default connect(({ loading, pointManageList }) => ({
  pointManageList,
  loading: loading.models.pointManage,
}))(PointCheck);
