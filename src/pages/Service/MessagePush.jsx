import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card, Result, Button, Space, Modal } from 'antd';
import { MSG_PSUH_TYPE } from '@/common/constant';
import AuthConsumer, { authCheck } from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

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
  // 设置faq
  const [faqSet, setFaqSet] = useState(false);

  useEffect(() => {
    setTabKey(check ? check[0]['key'] : false);
  }, []);

  useEffect(() => {
    tabkey && childRef.current.fetchGetData();
  }, [tabkey]);

  // 搜索参数
  const searchItems = [
    {
      label: '消息类型',
      name: 'likeStatus',
      type: 'select',
      select: { list: [] },
    },
    {
      label: '推送对象',
      name: 'likeStatus',
      type: 'select',
      select: { list: MSG_PSUH_TYPE },
    },
    {
      label: '推送状态',
      name: 'likeStatus',
      type: 'select',
      select: { list: [] },
    },
    {
      label: '推送时间',
      type: 'rangePicker',
      name: 'settleTimeStart',
      end: 'settleTimeEnd',
    },
    {
      label: '消息内容',
      name: 'questionTitle',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'image',
      render: (val, row, i) => i + 1,
    },
    {
      title: '消息标题',
      dataIndex: 'questionTitle',
      width: 250,
    },
    {
      title: '消息内容',
      dataIndex: 'createTime',
      width: 250,
    },
    {
      title: '消息类型',
      align: 'right',
      dataIndex: 'createName',
    },
    {
      title: '推送对象',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'updateName',
    },
    {
      title: '推送时间',
      align: 'center',
      dataIndex: 'noUse',
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'noUse',
    },
    {
      title: '推送人',
      align: 'center',
      dataIndex: 'noUse',
    },
    {
      title: '推送状态',
      align: 'center',
      dataIndex: 'noUse',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'questionCategoryIdString',
      render: (val, row) => {
        const { questionIdString: id, status } = row;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                visible: !val,
                click: () =>
                  setFaqSet({
                    type: 'edit',
                    detail: { ...row, questionCategoryId: row.questionCategoryIdStr },
                  }),
              },
              {
                type: 'eye',
                visible: !val,
                click: () =>
                  setFaqSet({
                    type: 'edit',
                    detail: { ...row, questionCategoryId: row.questionCategoryIdStr },
                  }),
              },
              {
                type: 'copy',
                visible: !val,
                click: () =>
                  setFaqSet({
                    type: 'edit',
                    detail: { ...row, questionCategoryId: row.questionCategoryIdStr },
                  }),
              },
              {
                type: 'push',
                visible: !val,
                click: () =>
                  setFaqSet({
                    type: 'edit',
                    detail: { ...row, questionCategoryId: row.questionCategoryIdStr },
                  }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 删除问题
  const fetchFAQDel = () => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要删除当前问题吗？删除后数据不可找回',
      onOk() {
        dispatch({
          type: 'serviceFAQ/fetchFAQDel',
          payload: { questionIds: delKey },
          callback: () => {
            setDelKey([]);
            childRef.current.fetchGetData();
          },
        });
      },
    });
  };

  return (
    <Card
      tabList={check}
      onTabChange={(key) => {
        setDelKey([]);
        setTabKey(key);
      }}
      tabBarExtraContent={
        <Space>
          <AuthConsumer auth="del">
            <Button className="dkl_green_btn" disabled={!delKey.length} onClick={fetchFAQDel}>
              批量删除
            </Button>
          </AuthConsumer>
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              onClick={() =>
                setFaqSet({ type: 'add', detail: { userType: tabkey, likeStatus: '0' } })
              }
            >
              新增推送
            </Button>
          </AuthConsumer>
        </Space>
      }
    >
      {check ? (
        <DataTableBlock
          CardNone={false}
          cRef={childRef}
          loading={loading.models.serviceFAQ}
          searchItems={searchItems}
          columns={getColumns}
          params={{ userType: tabkey }}
          rowKey={(record) => `${record.questionIdString}`}
          dispatchType="serviceFAQ/fetchGetList"
          rowSelection={{
            renderCell: (checked, record, i, originNode) => {
              if (record.questionCategoryIdString) return false;
              else return originNode;
            },
            selectedRowKeys: delKey,
            onChange: (val) => setDelKey(val),
          }}
          {...messagePush.list}
        ></DataTableBlock>
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
    </Card>
  );
};

export default connect(({ messagePush, loading }) => ({
  messagePush,
  loading,
}))(MessagePush);
