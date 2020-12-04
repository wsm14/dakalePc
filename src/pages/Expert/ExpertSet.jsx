import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Switch } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import classifySet from './components/ExpertSet/ClassifySet';
import ClassifyDetailList from './components/ExpertSet/ClassifyDetailList';

const ExpertSet = (props) => {
  const { list, loading, dispatch, tradeList } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

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
        <Switch
          checked={val == '1'}
          onClick={() => fetchGetMenuDetail({ accessId: record.authAccessId }, val)}
        />
      ),
    },
    {
      title: '话题',
      align: 'center',
      dataIndex: 'parentDomainId',
      render: (val, record) => val != 0 && <a onClick={() => setVisible({ record })}>设置</a>,
    },
    {
      title: '操作',
      dataIndex: 'domainId',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        const { topCategoryId: tcid, categoryId: cid } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                visible: record.parentDomainId !== 0,
                click: () =>
                  handleClassifySet(
                    {
                      ...record,
                      category: [`${tcid}`, `${cid}`],
                      parentDomainId: null,
                    },
                    record,
                  ),
              },
              {
                type: 'del',
                visible: record.parentDomainId !== 0,
                click: () => fetchClassifyDel({ domainId: val, deleteFlag: 0 }),
              },
              {
                type: 'own',
                visible: record.parentDomainId === 0,
                title: '添加内容分类',
                click: () =>
                  handleClassifySet(
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
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 新增/修改 领域/内容分类
  const handleClassifySet = (initialValues, rowDetail) => {
    dispatch({
      type: 'drawerForm/show',
      payload: classifySet({ dispatch, tradeList, childRef, initialValues, rowDetail }),
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
      <DataTableBlock
        btnExtra={[
          <Button
            className="dkl_green_btn"
            key="2"
            onClick={() => handleClassifySet({ parentDomainId: 0 })}
          >
            新增
          </Button>,
        ]}
        keepName="话题设置"
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.domainId}`}
        dispatchType="expertSet/fetchGetList"
        {...list}
        expandable={{ childrenColumnName: ['domainDTOList'] }}
        pagination={false}
      ></DataTableBlock>
      <ClassifyDetailList visible={visible} setVisible={setVisible}></ClassifyDetailList>
    </>
  );
};

export default connect(({ expertSet, sysTradeList, loading }) => ({
  list: expertSet.list,
  tradeList: sysTradeList.list.list,
  loading: loading.effects['expertSet/fetchGetList'],
}))(ExpertSet);
