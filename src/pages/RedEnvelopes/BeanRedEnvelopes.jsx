import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import { RED_ENVELOPES_TYPE_SHE, SHARE_SEX_TYPE, RED_ENVELOP_STATUS } from '@/common/constant';
import { notification } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import ExtraButton from '@/components/ExtraButton';
import { checkCityName } from '@/utils/utils';
import EnvelopSet from './components/BeanRedEnvelopes/EnvelopSet';
import EnvelopRecord from './components/BeanRedEnvelopes/EnvelopRecord';

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

const BeanRedEnvelopes = (props) => {
  const { redEnvelopes, loading, dispatch } = props;
  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0');
  const [visibleSet, setVisibleSet] = useState(false);
  const [visibleRecord, setVisibleRecord] = useState(false);
  useEffect(() => {
    childRef.current.fetchGetData(
      tabKey === '0' ? { envelopesType: 'lucky' } : { envelopesType: 'message' },
    );
  }, tabKey);

  const searchItems = [
    {
      label: '用户',
      name: 'sendUserId',
      type: 'user',
    },
    {
      label: '发放时间',
      type: 'rangePicker',
      name: 'sendBeginTime',
      end: 'sendEndTime',
    },

    {
      label: '红包金额',
      name: 'envelopeAmount',
      type: 'numberGroup',
    },
    {
      label: '注册地',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  const communitedSearch = [
    {
      label: '红包类型',
      name: 'envelopesType',
      type: 'multiple',
      select: RED_ENVELOPES_TYPE_SHE,
      onChange: (val) => {
        if (val.length === 0) {
          notification.info({
            message: '温馨提示',
            description: '紅包类型为必选项，不可为空',
          });
        }
      },
    },
  ];

  const privateSearch = [
    {
      label: '领取时间',
      type: 'rangePicker',
      name: 'acquireBeginTime',
      end: 'acquireEndTime',
    },
  ];

  //红包设置回显
  const handleSet = () => {
    dispatch({
      type: 'redEnvelopes/fetchgetDictionaryAdmin',
      payload: {
        parent: 'redEnvelope',
        child: 'lucky',
      },
      callback: (detail) => {
        setVisibleSet({
          show: true,
          detail,
        });
      },
    });
  };

  const btnList = [
    {
      auth: 'authEdit',
      text: '权限设置',
      onClick: handleSet,
    },
  ];

  const getColumns = [
    {
      title: '用户ID',
      fixed: 'left',
      dataIndex: 'sendUser',
      render: (val, row) => {
        const { sendUser = {} } = row;
        return sendUser.userIdString;
      },
    },
    {
      title: '豆号',
      dataIndex: 'sendUser',
      render: (val, row) => {
        const { sendUser = {} } = row;
        return sendUser.beanCode;
      },
    },
    {
      title: '注册手机号',
      dataIndex: 'sendUser',
      render: (val, row) => {
        const { sendUser = {} } = row;
        return sendUser.mobile;
      },
    },
    {
      title: '昵称',
      dataIndex: 'username',
      render: (val, row) => {
        const { sendUser = {} } = row;
        return sendUser.username;
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val, row) => {
        const { sendUser = {} } = row;
        return SHARE_SEX_TYPE[sendUser.gender];
      },
    },
    {
      title: '注册地',
      dataIndex: 'districtCode',
      render: (val, row) => {
        const { sendUser = {} } = row;
        return checkCityName(sendUser.districtCode) || '--';
      },
    },
    {
      title: '红包类型',
      dataIndex: 'envelopesType',
      show: tabKey === '0',
      render: (val) => RED_ENVELOPES_TYPE_SHE[val],
    },
    {
      title: '红包金额（卡豆）',
      dataIndex: 'bean',
    },
    {
      title: '领取情况',
      dataIndex: 'status',
      render: (val, row) => RED_ENVELOP_STATUS[val],
    },
    {
      title: '发放时间',
      dataIndex: 'createTime',
    },
    {
      title: '领取时间',
      dataIndex: 'acquireTime',
      show: tabKey === '1',
    },
    {
      title: '领取人ID',
      dataIndex: 'userIdString',
      show: tabKey === '1',
      render: (val, row) => {
        const { receiveUserList = [] } = row;
        const ids = receiveUserList.length
          ? receiveUserList.map((items) => items.userIdString)
          : [];
        return ids.toString();
        // return receiveUserList.length ? receiveUserList[0].userIdString : '-';
      },
    },
    {
      title: '操作',
      dataIndex: 'redEnvelopesIdString',
      type: 'handle',
      show: tabKey === '0',
      render: (val, row) => [
        {
          type: 'getRecord',
          title: '领取记录',
          click: () => fetchRecord(val, row),
        },
      ],
    },
  ];

  const fetchRecord = (redEnvelopesIdString, detail) => {
    setVisibleRecord({
      show: true,
      redEnvelopesIdString,
      detail,
    });
  };

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
        }}
        cRef={childRef}
        loading={loading}
        btnExtra={tabKey === '0' ? btnList : []}
        searchItems={
          tabKey === '0'
            ? [...searchItems, ...communitedSearch]
            : [...searchItems, ...privateSearch]
        }
        columns={getColumns}
        rowKey={(record) => `${record.redEnvelopesIdString}`}
        params={tabKey === '0' ? { envelopesType: 'lucky' } : { envelopesType: 'message' }}
        dispatchType="redEnvelopes/fetchListRedEnvelopesManagement"
        {...redEnvelopes}
      ></TableDataBlock>
      <EnvelopSet
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
        childRef={childRef}
      ></EnvelopSet>
      <EnvelopRecord
        visible={visibleRecord}
        onClose={() => setVisibleRecord(false)}
      ></EnvelopRecord>
    </>
  );
};

export default connect(({ redEnvelopes, loading }) => ({
  redEnvelopes,
  loading: loading.models.redEnvelopes,
}))(BeanRedEnvelopes);
