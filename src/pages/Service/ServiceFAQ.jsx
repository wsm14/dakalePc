import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { checkSorterData } from '@/utils/utils';
import { FAQ_LIKE_STATUS } from '@/common/constant';
import { Card, Result, Switch, Button, Space, Modal } from 'antd';
import AuthConsumer, { authCheck } from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import FAQSortList from './components/FAQ/List/FAQSortList';

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
  const { sortList } = serviceFAQ;

  const childRef = useRef();
  const check = authCheck(tabList);
  const [tabkey, setTabKey] = useState(false);
  const [delKey, setDelKey] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchFAQSortList();
    setTabKey(check ? check[0]['key'] : false);
  }, []);

  useEffect(() => {
    tabkey && childRef.current.fetchGetData();
  }, [tabkey]);

  // 搜索参数
  const searchItems = [
    {
      label: '问题分类',
      name: 'questionCategoryId',
      type: 'select',
      loading: loading.effects['serviceFAQ/fetchFAQSortList'],
      select: { list: sortList.list },
      fieldNames: { labelKey: 'questionCategoryName', valueKey: 'questionCategoryIdString' },
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
      align: 'center',
      dataIndex: 'createTime',
      sorter: (a, b) => checkSorterData(a, b, 'createTime', 'time'),
    },
    {
      title: '发布人',
      align: 'right',
      dataIndex: 'createName',
    },
    {
      title: '修改日期',
      align: 'center',
      dataIndex: 'updateTime',
      sorter: (a, b) => checkSorterData(a, b, 'updateTime', 'time'),
    },
    {
      title: '修改人',
      align: 'right',
      dataIndex: 'updateName',
    },
    {
      title: '有用/没用',
      align: 'right',
      dataIndex: 'noUse',
      render: (val, row) => row.questionIdString && `${row.beUse} / ${val}`,
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'sort',
    },
    {
      title: '猜你想问',
      dataIndex: 'likeStatus',
      fixed: 'right',
      align: 'right',
      render: (val, row) => {
        const { questionIdString: id } = row;
        return (
          row.questionIdString && (
            <AuthConsumer auth="setLike" noAuth={FAQ_LIKE_STATUS[val]}>
              <a onClick={() => fetchFAQEdit({ id, likeStatus: 1 ^ Number(val) })}>
                {val === '0' ? '设置' : '取消设置'}
              </a>
            </AuthConsumer>
          )
        );
      },
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'questionCategoryId',
      render: (val, row) => {
        const { questionIdString: id, status } = row;
        return (
          <>
            <AuthConsumer auth="status">
              <Switch
                checkedChildren="启"
                unCheckedChildren="停"
                checked={row.status === '1'}
                onClick={() => fetchFAQEdit({ id, status: 1 ^ Number(status) })}
              />
            </AuthConsumer>
            <HandleSetTable
              formItems={[
                {
                  type: 'edit',
                  visible: !!val,
                  click: () => fetchNewsStatus({ newsId: val, status: 0 }),
                },
              ]}
            />
          </>
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

  // 问题分类列表
  const fetchFAQSortList = () => {
    dispatch({
      type: 'serviceFAQ/fetchFAQSortList',
      payload: { page: 1, limit: 99 },
    });
  };

  // 问题编辑
  const fetchFAQEdit = (payload) => {
    dispatch({
      type: 'serviceFAQ/fetchFAQEdit',
      payload,
      callback: childRef.current.fetchGetData,
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
            <Button className="dkl_green_btn" onClick={() => setVisible(true)}>
              分类管理
            </Button>
          </AuthConsumer>
          <AuthConsumer auth="del">
            <Button className="dkl_green_btn" disabled={!delKey.length} onClick={fetchFAQDel}>
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
          loading={loading.models.serviceFAQ}
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
          {...serviceFAQ.list}
        ></DataTableBlock>
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
      <FAQSortList
        qRef={childRef}
        visible={visible}
        setVisible={() => setVisible(false)}
      ></FAQSortList>
    </Card>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  serviceFAQ,
  loading,
}))(ServiceFAQ);
