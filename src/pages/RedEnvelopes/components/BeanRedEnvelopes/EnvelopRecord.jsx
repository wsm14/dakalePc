import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Modal } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { checkCityName } from '@/utils/utils';
import { RED_ENVELOPES_TYPE_SHE, SHARE_SEX_TYPE } from '@/common/constant';

const tabList = [
  {
    key: '0',
    tab: '社群红包',
  },
  {
    key: '1',
    tab: '私信红包',
  },
];

const EnvelopRecord = (props) => {
  const cRef = useRef();
  const { loading, recordList, visible, onClose, dispatch } = props;
  const { show = false, redEnvelopesIdString, detail = {} } = visible;
  const { sendUser = {} } = detail;
  const initialValues = { ...detail, ...sendUser };

  useEffect(() => {
    if (redEnvelopesIdString) {
      //   cRef.current.fetchGetData();
      dispatch({
        type: 'redEnvelopes/fetchListRedEnvelopesReceives',
        payload: {
          redEnvelopesIdString,
        },
      });
    }
  }, [redEnvelopesIdString]);
  const formItems = [
    {
      label: '发红包人',
      name: 'username',
    },
    {
      label: '红包类型',
      name: 'envelopesType',
      render: (val) => RED_ENVELOPES_TYPE_SHE[val],
    },
    {
      label: '红包金额',
      name: 'bean',
      render: (val) => val + '卡豆',
    },
    {
      label: '领取情况',
      name: 'personAmount',
      render: (val, row) =>
        `可领取红包的总人数:${val}\n已领取红包的人数:${row.receivePersonAmount}`,
    },
    {
      label: '发放时间',
      name: 'createTime',
    },
  ];

  const [tabKey, setTabKey] = useState('0');

  const getColumns = [
    {
      title: '用户ID',
      fixed: 'left',
      dataIndex: 'userIdString',
    },
    {
      title: '豆号',
      dataIndex: 'beanCode',
      render: (val, row) => {
        const { receiveUser = {} } = row;
        return receiveUser.beanCode;
      },
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
      render: (val, row) => {
        const { receiveUser = {} } = row;
        return receiveUser.mobile;
      },
    },
    {
      title: '昵称',
      dataIndex: 'username',
      render: (val, row) => {
        const { receiveUser = {} } = row;
        return receiveUser.username;
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val, row) => {
        const { receiveUser = {} } = row;
        return SHARE_SEX_TYPE[receiveUser.val];
      },
    },
    {
      title: '注册地',
      dataIndex: 'districtCode',
      render: (val, row) => {
        const { receiveUser = {} } = row;
        return checkCityName(receiveUser.districtCode) || '--';
      },
    },
    {
      title: '领取卡豆数',
      dataIndex: 'bean',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      render: (val, row) => {
        const { receiveUser = {} } = row;
        return receiveUser.createTime;
      },
    },
    {
      title: '领取时间',
      dataIndex: 'createTime',
    },
  ];

  const modalProps = {
    title: '卡豆红包领取记录',
    visible: show,
    width: 1200,
    onCancel: onClose,
  };
  return (
    <Modal {...modalProps}>
      <DescriptionsCondition
        formItems={formItems}
        initialValues={initialValues}
      ></DescriptionsCondition>
      <TableDataBlock
        cardProps={{
          bordered: false,
        //   tabList: tabList,
        //   activeTabKey: tabKey,
        //   onTabChange: setTabKey,
        }}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.userIdString}`}
        // dispatchType="redEnvelopes/fetchListRedEnvelopesReceives"
        {...recordList}
      ></TableDataBlock>
    </Modal>
  );
};
export default connect(({ loading, redEnvelopes }) => ({
  ...redEnvelopes,
  loading: loading.models.redEnvelopes,
}))(EnvelopRecord);
