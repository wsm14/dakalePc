import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';
import { OPEN_GROUP_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import OpenGroupDetail from './components/OpenGroupList/OpenGroupDetail';
import { fetchGetGroupForSearch } from '@/services/PublicServices';

const OpenGroupList = (props) => {
  const { loading, dispatch, openGroupList } = props;
  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '拼团ID',
      name: 'groupId',
    },
    {
      label: '发起人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '开团时间',
      type: 'rangePicker',
      name: 'startTime',
      end: 'endTime',
      allowClear: false,
    },
    {
      label: '拼团状态',
      type: 'select',
      name: 'status',
      select: OPEN_GROUP_STATUS,
    },
  ];

  const getColumns = [
    {
      title: '商品名称',
      fixed: 'left',
      dataIndex: 'groupId',
      width: 350,
      render: (val, row) => {
        const { togetherEarnGoodsObject = {} } = row;
        const { goodsName = '', goodsImg = '' } = togetherEarnGoodsObject;
        return (
          <div style={{ display: 'flex' }}>
            <PopImgShow url={goodsImg} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                marginLeft: 5,
              }}
            >
              <Ellipsis length={5} tooltip lines={2}>
                {goodsName}
              </Ellipsis>
              <div style={{ color: '#999', marginTop: 10 }}>拼团ID:{val}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '商品价格',
      align: 'center',
      dataIndex: 'togetherEarnGoodsObject',
      render: (val, row) => {
        const { togetherEarnGoodsObject = {} } = row;
        return `￥${togetherEarnGoodsObject.togetherPrice}`;
      },
    },
    {
      title: '发起人',
      align: 'center',
      dataIndex: 'username',
      render: (val, row) => {
        const { togetherUserSnapshotObject = {} } = row;
        return togetherUserSnapshotObject.username
          ? `${togetherUserSnapshotObject.username}\n${togetherUserSnapshotObject.mobile}`
          : '--';
      },
    },
    {
      title: '开团时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '参团人数',
      align: 'center',
      dataIndex: 'joinUserNum',
    },
    {
      title: '剩余时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => {
        const { status = '' } = row;
        if (val) {
          const endTime = moment(val).add(24, 'hours').format('YYYY-MM-DD HH:mm:ss'); // 剩余时间
          if (moment(endTime).isBefore(moment()) || ['1', '2'].includes(status)) {
            return '--';
          } else {
            const remainTime = moment(endTime).diff(moment(), 'seconds');
            const h = parseInt(remainTime / 3600);
            const m = parseInt((remainTime - h * 3600) / 60);
            const s = remainTime - h * 3600 - m * 60;
            const H = h > 9 ? h : `0${h}`;
            const M = m > 9 ? m : `0${m}`;
            const S = s > 9 ? s : `0${s}`;
            return `${H}:${M}:${S}`;
          }
        } else {
          return '--';
        }
      },
    },
    {
      title: '拼团状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => OPEN_GROUP_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'groupId',
      width: 150,
      render: (val, record) => {
        return [
          {
            type: 'info',
            title: '拼团详情',
            click: () => fetchDetail(val),
          },
          {
            type: 'immediateGroup',
            title: '立即成团',
            pop: true,
            popText: '确定要立即成团吗？立即成团后将在已参与的用户中随机抽取3位用户拼中商品。',
            visible: record.joinUserNum >= 8 && record.status == '0', //拼团中并且参团人数大于等于8人
            click: () => fetchGetGroup(val),
          },
        ];
      },
    },
  ];

  //立即成团
  const fetchGetGroup = (groupId) => {
    dispatch({
      type: 'openGroupList/fetchSimulationStartGroup',
      payload: {
        groupId,
      },
      callback: childRef.current.fetchGetData,
    });
  };

  //参团详情
  const fetchDetail = (groupId) => {
    dispatch({
      type: 'openGroupList/fetchAdminListJoinGroupByGroupId',
      payload: {
        groupId,
      },
      callback: (list) => {
        setVisible({
          show: true,
          list,
        });
      },
    });
  };

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.groupId}`}
        timeParams={{
          time: {
            startTime: moment().subtract(1, 'month').format('YYYY-MM-DD'),
            endTime: moment().format('YYYY-MM-DD'),
          },
          show: {
            startTime: [moment().subtract(1, 'month'), moment()],
          },
        }}
        dispatchType="openGroupList/fetchGetList"
        {...openGroupList}
      ></TableDataBlock>
      <OpenGroupDetail visible={visible} onClose={() => setVisible(false)}></OpenGroupDetail>
    </>
  );
};

export default connect(({ loading, openGroupList }) => ({
  openGroupList,
  loading: loading.models.openGroupList,
}))(OpenGroupList);
