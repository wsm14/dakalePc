import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Switch } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import ClassifySet from './components/ExpertSet/ClassifySet';
import ClassifyDetailList from './components/ExpertSet/ClassifyDetailList';

const ExpertSet = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');
  const [visibleSet, setVisibleSet] = useState(false);

  // table 表头
  const getColumns = [
    {
      title: '哒人领域/内容分类',
      fixed: 'left',
      dataIndex: 'domainName',
    },
    {
      title: '显示状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, record) => (
        <AuthConsumer auth="status" noAuth={val === '1' ? '显示' : '不显示'}>
          <Switch
            checked={val == '1'}
            onClick={() =>
              fetchClassifyStatusEdit(
                { domainId: record.domainId, status: 1 ^ Number(record.status) },
                val,
              )
            }
          />
        </AuthConsumer>
      ),
    },
    {
      title: '话题',
      align: 'center',
      dataIndex: 'parentDomainId',
      render: (val, record) => (
        <AuthConsumer auth="topic" show={val != 0}>
          <a onClick={() => setVisible({ record })}>设置</a>
        </AuthConsumer>
      ),
    },
    {
      title: '操作',
      dataIndex: 'domainId',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { topCategoryId: tcid, categoryId: cid, parentDomainId: pid } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                // visible: record.parentDomainId !== 0,
                click: () =>
                  handleClassifySet(
                    'edit',
                    {
                      ...record,
                      category: [`${tcid}`, `${cid}`],
                      parentDomainId: pid == 0 ? 0 : null,
                    },
                    record,
                  ),
              },
              {
                type: 'del',
                visible: pid !== 0,
                click: () => fetchClassifyDel({ domainId: val, deleteFlag: 0 }),
              },
              {
                type: 'own',
                visible: pid === 0,
                title: '添加内容分类',
                auth: 'saveClassify',
                click: () =>
                  handleClassifySet(
                    'own',
                    {
                      parentDomainId: val,
                      domainNameShow: record.domainName,
                    },
                    record,
                  ),
              },
            ]}
          />
        );
      },
    },
  ];

  // 状态修改
  const fetchClassifyStatusEdit = (values) => {
    dispatch({
      type: 'expertSet/fetchClassifyEdit',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 经营类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 删除
  const fetchClassifyDel = (values) => {
    dispatch({
      type: 'expertSet/fetchClassifyDel',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 新增/修改 领域/内容分类
  const handleClassifySet = (type, initialValues, rowDetail) => {
    setVisibleSet({
      show: true,
      type,
      initialValues,
      rowDetail,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'expertSet/clearDetail',
    });
    fetchTradeList();
  }, [visible]);

  return (
    <>
      <TableDataBlock
        btnExtra={
          <AuthConsumer auth="savePClassify">
            <Button
              className="dkl_green_btn"
              onClick={() => handleClassifySet('add', { parentDomainId: 0 })}
            >
              新增
            </Button>
          </AuthConsumer>
        }
        keepData
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.domainId}`}
        dispatchType="expertSet/fetchGetList"
        {...list}
        expandable={{ childrenColumnName: ['domainDTOList'] }}
        pagination={false}
      ></TableDataBlock>
      <ClassifyDetailList visible={visible} setVisible={setVisible}></ClassifyDetailList>
      <ClassifySet
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></ClassifySet>
    </>
  );
};

export default connect(({ expertSet, loading }) => ({
  list: expertSet.list,
  loading: loading.effects['expertSet/fetchGetList'],
}))(ExpertSet);
