import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { NEWS_STATUS } from '@/common/constant';
import { Card, Result } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
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
  const [tabkey, setTabKey] = useState(false);
  const check = authCheck(tabList);

  useEffect(() => {
    setTabKey(check ? check[0]['key'] : false);
  }, []);

  useEffect(() => {
    console.log(tabkey);
    tabkey && childRef.current.fetchGetData();
  }, [tabkey]);

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
      dataIndex: 'status',
      render: (val) => NEWS_STATUS[val],
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '猜你想问',
      dataIndex: 'status',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'questionCategoryId',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'down',
              visible: record.status === '1',
              click: () => fetchNewsStatus({ newsId: val, status: 0 }),
            },
            // {
            //   type: 'own',
            //   pop: true,
            //   visible: record.status === '1',
            //   title: '上架',
            // },
          ]}
        />
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
    <Card tabList={check} onTabChange={(key) => setTabKey(key)}>
      {check ? (
        <DataTableBlock
          NoSearch
          CardNone={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          params={{ userType: tabkey }}
          rowKey={(record) =>
            `${record.questionCategoryIdString || record.questionIdString}`
          }
          dispatchType="serviceFAQ/fetchGetList"
          childrenColumnName="commonQuestionList"
          rowSelection={{
            fixed: true,
            renderCell: (checked, record) => {
              if (record.commonQuestionList) return false;
              else return true;
            },
            // selectedRowKeys,
            // onChange: (val) => setSelectedRowKeys(val),
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
