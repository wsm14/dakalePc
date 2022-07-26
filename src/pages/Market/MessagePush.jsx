import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card, Result, Modal } from 'antd';
import { MSG_PSUH_TYPE, MSG_PSUH_OBJECT, MSG_PSUH_STATUS } from '@/common/constant';
import { authCheck } from '@/layouts/AuthConsumer';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import MessageDrawer from './components/MessagePush/MessageDrawer';

const tabList = [
  {
    key: 'user',
    auth: 'userOs',
    tab: '用户端',
  },
  {
    key: 'merchant',
    auth: 'mreOs',
    tab: '商家端',
  },
];

const MessagePush = (props) => {
  const { messagePush, loading, dispatch } = props;

  const childRef = useRef();
  const check = authCheck(tabList);
  // tab分类
  const [tabkey, setTabKey] = useState(false);
  // 多选删除项木key
  const [delKey, setDelKey] = useState([]);
  // 设置 修改 详情
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  useEffect(() => {
    tabkey && childRef.current.fetchGetData();
  }, [tabkey]);

  // 搜索参数
  const searchItems = [
    {
      label: '消息类型',
      name: 'messageType',
      type: 'select',
      select: MSG_PSUH_TYPE,
    },
    {
      label: '推送对象',
      name: 'pushObjectType',
      type: 'select',
      allItem: false,
      select: MSG_PSUH_OBJECT,
    },
    {
      label: '推送状态',
      name: 'pushStatus',
      type: 'select',
      select: MSG_PSUH_STATUS,
    },
    {
      label: '推送时间',
      type: 'rangePicker',
      name: 'pushTimeStart',
      end: 'pushTimeEnd',
    },
    {
      label: '消息内容',
      name: 'content',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '消息标题',
      fixed: 'left',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      width: 250,
    },
    {
      title: '消息类型',
      align: 'right',
      dataIndex: 'messageType',
      render: (val) => MSG_PSUH_TYPE[val],
    },
    {
      title: '推送对象',
      align: 'center',
      dataIndex: 'pushObjectType',
      render: (val) => MSG_PSUH_OBJECT[val],
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '推送时间',
      align: 'center',
      dataIndex: 'pushTime',
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'creator',
    },
    {
      title: '推送人',
      align: 'center',
      dataIndex: 'pusher',
    },
    {
      title: '推送状态',
      align: 'center',
      dataIndex: 'pushStatus',
      render: (val) => MSG_PSUH_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'messagePushId',
      render: (val, row) => {
        const { pushStatus: status } = row;
        return [
          {
            type: 'push', // 推送 未推送
            visible: status === '0',
            pop: true,
            click: () => fetchMsgPushHandle(val, 'push'),
          },
          {
            type: 'edit', // 修改
            visible: status === '0',
            click: () => fetchMsgPushDeatil(val, 'edit'),
          },
          {
            type: 'revoke', // 撤销 推送中 推送成功
            visible: ['1', '2'].includes(status),
            pop: true,
            click: () => fetchMsgPushHandle(val, 'revoke'),
          },
          {
            type: 'copy', // 复制
            pop: true,
            click: () => fetchMsgPushHandle(val, 'copy'),
          },
          {
            type: 'eye', // 查看
            click: () => fetchMsgPushDeatil(val, 'info'),
          },
        ];
      },
    },
  ];

  // 获取详情 type：info 查看 edit 修改
  const fetchMsgPushDeatil = (id, type) => {
    dispatch({
      type: 'messagePush/fetchMsgPushDetail',
      payload: { messagePushId: id },
      callback: (detail) => setVisible({ type, shwo: true, detail }),
    });
  };

  // 按钮操作 type: push 推送 revoke 撤销 copy 复制
  const fetchMsgPushHandle = (id, type) => {
    const api = {
      push: 'messagePush/fetchMsgPush',
      revoke: 'messagePush/fetchMsgPushRevoke',
      copy: 'messagePush/fetchMsgPushCopy',
    }[type];
    dispatch({
      type: api,
      payload: { id },
      callback: childRef.current.fetchGetData,
    });
  };

  // 删除
  const fetchMsgPushDel = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除当前消息吗？删除后数据不可找回',
      onOk() {
        dispatch({
          type: 'messagePush/fetchMsgPushDel',
          payload: { messagePushIds: delKey },
          callback: () => {
            setDelKey([]);
            childRef.current.fetchGetData();
          },
        });
      },
    });
  };

  const btnList = [
    {
      auth: 'del',
      disabled: !delKey.length,
      onClick: fetchMsgPushDel,
      text: '批量删除',
    },
    {
      auth: 'save',
      onClick: () =>
        setVisible({
          type: 'add',
          shwo: true,
          detail: { pushObjectType: 'all', userType: tabkey },
        }),
      text: '新增推送',
    },
  ];

  return (
    <>
      <Card
        tabList={check}
        onTabChange={(key) => {
          setDelKey([]);
          setTabKey(key);
        }}
        tabBarExtraContent={<ExtraButton list={btnList}></ExtraButton>}
      >
        {check && check.length ? (
          <TableDataBlock
            order
            firstFetch={false}
            noCard={false}
            cRef={childRef}
            loading={loading.models.messagePush}
            searchItems={searchItems}
            columns={getColumns}
            params={{ userType: tabkey }}
            rowKey={(record) => `${record.messagePushId}`}
            dispatchType="messagePush/fetchGetList"
            rowSelection={{
              selectedRowKeys: delKey,
              onChange: (val) => setDelKey(val),
            }}
            {...messagePush.list}
          ></TableDataBlock>
        ) : (
          <Result status="403" title="403" subTitle="暂无权限"></Result>
        )}
      </Card>
      <MessageDrawer
        userType={tabkey}
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></MessageDrawer>
    </>
  );
};

export default connect(({ messagePush, loading }) => ({
  messagePush,
  loading,
}))(MessagePush);
