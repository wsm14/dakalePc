import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { FAQ_LIKE_STATUS } from '@/common/constant';
import { Card, Result, Switch, Button, Space } from 'antd';
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

const ServiceFAQ = (props) => {
  const { serviceFAQ, loading, dispatch } = props;

  const childRef = useRef();
  const check = authCheck(tabList);
  const [tabkey, setTabKey] = useState(false);
  const [delKey, setDelKey] = useState([]);

  useEffect(() => {
    setTabKey(check ? check[0]['key'] : false);
  }, []);

  useEffect(() => {
    tabkey && childRef.current.fetchGetData();
  }, [tabkey]);

  // 搜索参数
  const searchItems = [
    {
      label: '问题分类',
      name: 'username',
      type: 'select',
      select: { list: FAQ_LIKE_STATUS },
    },
    {
      label: '关键字',
      name: 'questionTitle',
    },
    {
      label: '猜你想问',
      name: 'likeStatus',
      type: 'select',
      select: { list: FAQ_LIKE_STATUS },
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
      title: 'FAQ标题',
      dataIndex: 'questionCategoryName',
    },
    {
      title: '发布日期',
      dataIndex: 'createTime',
    },
    {
      title: '发布人',
      dataIndex: 'createName',
    },
    {
      title: '修改日期',
      dataIndex: 'updateTime',
    },
    {
      title: '修改人',
      dataIndex: 'updateName',
    },
    {
      title: '有用/没用',
      dataIndex: 'noUse',
      render: (val, row) => row.questionIdString && `${row.beUse} / ${val}`,
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '猜你想问',
      dataIndex: 'likeStatus',
      render: (val, row) =>
        row.questionIdString && (
          <AuthConsumer auth="setLike" noAuth={FAQ_LIKE_STATUS[val]}>
            <a>{val === '0' ? '设置' : '取消设置'}</a>
          </AuthConsumer>
        ),
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'questionCategoryId',
      render: (val, row) => (
        <>
          <AuthConsumer auth="status">
            <Switch
              checkedChildren="启"
              unCheckedChildren="停"
              checked={row.status === '1'}
              onClick={() => fetchGetMenuDetail({ accessId: record.authAccessId }, val)}
            />
          </AuthConsumer>
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                visible: row.status === '1',
                click: () => fetchNewsStatus({ newsId: val, status: 0 }),
              },
            ]}
          />
        </>
      ),
    },
  ];

  // 下架视频
  const fetchNewsStatus = (payload) => {
    dispatch({
      type: 'serviceNews/fetchNewsStatus',
      payload,
      callback: () => childRef.current.fetchGetData(),
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
          <AuthConsumer auth="sortFAQ">
            <Button
              className="dkl_green_btn"
              onClick={() => setVisibleEdit({ type: 'add', show: true, info: false })}
            >
              分类管理
            </Button>
          </AuthConsumer>
          <AuthConsumer auth="del">
            <Button className="dkl_green_btn" disabled={!delKey.length} onClick={() => {}}>
              批量删除
            </Button>
          </AuthConsumer>
          <AuthConsumer auth="save">
            <Button className="dkl_green_btn" onClick={() => {}}>
              新增问题
            </Button>
          </AuthConsumer>
        </Space>
      }
    >
      {check ? (
        <DataTableBlock
          NoSearch
          CardNone={false}
          cRef={childRef}
          loading={loading}
          searchItems={searchItems}
          columns={getColumns}
          params={{ userType: tabkey }}
          rowKey={(record) => `${record.questionCategoryIdString || record.questionIdString}`}
          dispatchType="serviceFAQ/fetchGetList"
          childrenColumnName="commonQuestionList"
          rowSelection={{
            renderCell: (checked, record, i, originNode) => {
              if (record.questionCategoryIdString) return false;
              else return originNode;
            },
            selectedRowKeys: delKey,
            onChange: (val) => setDelKey(val),
          }}
          {...serviceFAQ}
        ></DataTableBlock>
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
    </Card>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  serviceFAQ,
  loading: loading.models.serviceFAQ,
}))(ServiceFAQ);
