import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { checkSorterData } from '@/utils/utils';
import { FAQ_LIKE_STATUS } from '@/common/constant';
import { Card, Result, Switch, Button, Space, Modal } from 'antd';
import AuthConsumer, { authCheck } from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import DraggableContent, { DragHandle } from '@/components/TableDataBlock/SortBlock';
import FAQSortList from './components/FAQ/List/FAQSortList';
import FAQSet from './components/FAQ/Form/FAQSet';

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
  const { sortList, list: FAQList } = serviceFAQ;

  const childRef = useRef();
  const check = authCheck(tabList);
  // tab分类
  const [tabkey, setTabKey] = useState(false);
  // 多选删除项木key
  const [delKey, setDelKey] = useState([]);
  // 分类列表
  const [visible, setVisible] = useState(false);
  // 设置faq
  const [faqSet, setFaqSet] = useState(false);
  // 展开行
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  useEffect(() => {
    if (!visible) fetchFAQSortList();
  }, [visible]);

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
      className: 'drag-visible',
      dataIndex: 'questionTitle',
      width: 250,
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
      render: (val, row) => !row.questionCategoryIdString && `${row.beUse} / ${val}`,
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'sort',
      render: (val, row) =>
        expandedRowKeys.length && row.questionCategoryIdString ? '' : <DragHandle />,
    },
    {
      title: '猜你想问',
      dataIndex: 'likeStatus',
      fixed: 'right',
      align: 'right',
      render: (val, row) => {
        const { questionIdString: id } = row;
        return (
          <AuthConsumer
            auth="setLike"
            noAuth={FAQ_LIKE_STATUS[val]}
            show={!row.questionCategoryIdString}
          >
            <a onClick={() => fetchFAQEdit({ id, likeStatus: 1 ^ Number(val) })}>
              {val === '0' ? '设置' : '取消设置'}
            </a>
          </AuthConsumer>
        );
      },
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'questionCategoryIdString',
      render: (val, row) => {
        const { questionIdString: id, status } = row;
        return (
          <>
            <AuthConsumer auth="status">
              <Switch
                checkedChildren="启"
                unCheckedChildren="停"
                checked={row.status === '1'}
                onClick={() =>
                  !!val
                    ? fetchFAQSortEdit({ id: val, status: 1 ^ Number(status) })
                    : fetchFAQEdit({ id, status: 1 ^ Number(status) })
                }
              />
            </AuthConsumer>
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

  // 问题分类编辑
  const fetchFAQSortEdit = (payload) => {
    dispatch({
      type: 'serviceFAQ/fetchFAQSortEdit',
      payload,
      callback: childRef.current.fetchGetData,
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

  // 问题排序
  const fetchFAQSort = (payload) => {
    dispatch({
      type: 'serviceFAQ/fetchFAQSort',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 顶部数据源
  const topScoureIndex =
    FAQList.list.findIndex((item) => item.questionCategoryIdString === expandedRowKeys[0]) + 1;

  // 参与排序的源数据 父级列表 或者 子列表  expandedRowKeys.length > 0 则是对子类操作 否则是父类
  const faqProps = expandedRowKeys.length
    ? {
        // 子级排序
        type: 'faq',
        key: 'questionIdString',
        sourceData: [
          ...FAQList.list.slice(0, topScoureIndex),
          ...FAQList.list.filter((item) => item.questionCategoryIdString === expandedRowKeys[0])[0]
            .commonQuestionList,
          ...FAQList.list.slice(topScoureIndex),
        ],
        sortKey: 'commonQuestionList', // 传递给后端的key
      }
    : {
        // 父级排序
        type: 'class',
        key: 'questionCategoryIdString', // 排序后获取值的key
        sourceData: FAQList.list, // 排序数据源
        sortKey: 'commonQuestionCategoryList', // 传递给后端的key
      };

  return (
    <Card
      tabList={check}
      onTabChange={(key) => {
        setExpandedRowKeys([]);
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
            <Button
              className="dkl_green_btn"
              onClick={() =>
                setFaqSet({ type: 'add', detail: { userType: tabkey, likeStatus: '0' } })
              }
            >
              新增问题
            </Button>
          </AuthConsumer>
        </Space>
      }
    >
      {check && check.length ? (
        <TableDataBlock
          NoSearch
          noCard={false}
          cRef={childRef}
          loading={loading.models.serviceFAQ}
          searchItems={searchItems}
          columns={getColumns}
          params={{ userType: tabkey }}
          rowKey={(record) => `${record.questionIdString}`}
          dispatchType="serviceFAQ/fetchGetList"
          childrenColumnName="commonQuestionList"
          // 排序
          {...DraggableContent(
            // 参与排序的源数据 父级列表 或者 子列表  expandedRowKeys.length > 0 则是对子类操作 否则是父类
            faqProps.sourceData,
            {
              key: 'questionIdString',
              // 排序回调
              onSortEnd: (val) => {
                // 若是子级排序过滤父级数组
                const newArr = !expandedRowKeys.length
                  ? val
                  : val.filter(
                      (i) =>
                        !FAQList.list.some(
                          (faq) => faq.questionIdString == i.questionCategoryIdString,
                        ),
                    );
                // 传递排序后数据
                fetchFAQSort({
                  type: faqProps.type,
                  [faqProps.sortKey]: newArr.map((item, i) => ({
                    id: item[faqProps.key],
                    sort: i,
                  })),
                });
              },
            },
          )}
          // 展开一个子级
          expandable={{
            expandedRowKeys,
            onExpand: (expanded, row) =>
              setExpandedRowKeys(expanded ? [row.questionCategoryIdString] : []),
          }}
          rowSelection={{
            renderCell: (checked, record, i, originNode) => {
              if (record.questionCategoryIdString) return false;
              else return originNode;
            },
            selectedRowKeys: delKey,
            onChange: (val) => setDelKey(val),
          }}
          {...FAQList}
        ></TableDataBlock>
      ) : (
        <Result status="403" title="403" subTitle="暂无权限"></Result>
      )}
      <FAQSortList
        qRef={childRef}
        visible={visible}
        setVisible={() => setVisible(false)}
      ></FAQSortList>
      <FAQSet
        typeList={check}
        cRef={childRef}
        visible={faqSet}
        onClose={() => setFaqSet(false)}
      ></FAQSet>
    </Card>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  serviceFAQ,
  loading,
}))(ServiceFAQ);
