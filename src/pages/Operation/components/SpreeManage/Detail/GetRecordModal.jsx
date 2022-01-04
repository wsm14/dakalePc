import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import SpreeUserUseInfo from './SpreeUserUseInfo';

const GetRecordModal = (props) => {
  const { visible, onClose, loading, getRecordList } = props;
  const { show = false, detail = {} } = visible;
  const { platformGiftId = '' } = detail;

  const childRef = useRef();
  const [state, setState] = useState(false); // 使用情况

  // 搜索参数
  const searchItems = [
    {
      label: '领取用户',
      type: 'user',
      name: 'userId',
    },
    {
      label: '领取时间',
      type: 'rangePicker',
      name: 'createTimeBegin',
      end: 'createTimeEnd',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '领取用户昵称',
      align: 'center',
      dataIndex: 'username',
    },
    {
      title: '用户手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '用户豆号',
      align: 'center',
      dataIndex: 'beanCode',
    },
    {
      title: '领取时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      type: 'handle',
      align: 'center',
      dataIndex: 'userPlatformGiftReceiveId',
      render: (val, detail) => {
        return [
          {
            type: 'useInfo',
            click: () => setState({ show: true, detail }),
          },
        ];
      },
    },
  ];

  const modalProps = {
    title: '领取明细',
    visible: show,
    width: 1000,
    onCancel: onClose,
  };
  return (
    <>
      <Modal {...modalProps} destroyOnClose>
        <TableDataBlock
          noCard={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          rowKey={(record) => `${record.userPlatformGiftReceiveId}`}
          params={{ platformGiftId: platformGiftId }}
          dispatchType="spreeManage/fetchListUserGiftReceiveByPage"
          {...getRecordList}
        ></TableDataBlock>
      </Modal>
      {/* 使用情况 */}
      <SpreeUserUseInfo
        visible={state}
        childRef={childRef}
        onClose={() => setState(false)}
      ></SpreeUserUseInfo>
    </>
  );
};

export default connect(({ spreeManage, loading }) => ({
  getRecordList: spreeManage.getRecordList,
  loading: loading.effects['spreeManage/fetchListUserGiftReceiveByPage'],
}))(GetRecordModal);
