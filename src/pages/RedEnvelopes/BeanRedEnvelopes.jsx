import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import ExtraButton from '@/components/ExtraButton';
import EnvelopSet from './components/BeanRedEnvelopes/EnvelopSet';

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
  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0');
  const [visibleSet, setVisibleSet] = useState(false);

  const searchItems = [
    {
      label: '注册手机号',
      name: 'goodsName',
    },
    {
      label: '用户昵称',
      name: 'goodsName',
    },
    {
      label: '发放时间',
      name: 'goodsName',
    },
    {
      label: '红包金额',
      name: 'goodsName',
    },
    {
      label: '注册地',
      name: 'goodsName',
    },
  ];

  const communitedSearch = [
    {
      label: '红包类型',
      name: 'goodsName',
    },
  ];

  const privateSearch = [
    {
      label: '领取时间',
      name: 'goodsName',
    },
  ];

  useEffect(() => {
    childRef.current.fetchGetData({ type: tabKey });
  }, [tabKey]);

  const handleSet = () => {
    setVisibleSet(true);
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
      dataIndex: 'userId',
    },
    {
      title: '豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
    },
    {
      title: '昵称',
      dataIndex: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'mobile',
    },
    {
      title: '注册地',
      dataIndex: 'mobile',
    },
    {
      title: '红包类型',
      dataIndex: 'mobile',
    },
    {
      title: '红包金额（元）',
      dataIndex: 'mobile',
    },
    {
      title: '领取情况',
      dataIndex: 'mobile',
    },
    {
      title: '发放时间',
      dataIndex: 'mobile',
    },
    {
      title: '领取时间',
      dataIndex: 'mobile',
      show: tabKey === '1',
    },
    {
      title: '操作',
      dataIndex: 'mobile',
      type: 'handle',
      show: tabKey === '0',
      render: (val) => [
        {
          type: 'getRecord',
          title: '领取记录',
          click: () => fetchRecord(),
        },
      ],
    },
  ];

  const fetchRecord = () => {};

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
        }}
        cRef={childRef}
        btnExtra={tabKey === '0' ? btnList : []}
        searchItems={
          tabKey === '0'
            ? [...searchItems, ...communitedSearch]
            : [...searchItems, ...privateSearch]
        }
        columns={getColumns}
        rowKey={(record) => `${record.orderRefundId}`}
        dispatchType=""
      ></TableDataBlock>
      <EnvelopSet
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
        childRef={childRef}
      ></EnvelopSet>
    </>
  );
};
export default connect()(BeanRedEnvelopes);
