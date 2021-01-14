import React, { useRef } from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import faqSortSet from '../Form/FAQSortSet';

const FAQSortList = (props) => {
  const { sortList, qRef, loading, visible, setVisible, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '关键字',
      name: 'questionCategoryName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: 'FAQ分类名称',
      dataIndex: 'questionCategoryName',
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'questionCategoryIdString',
      render: (id, row) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'del',
                popText: (
                  <>
                    <div>删除此分类后</div>
                    <div>分类下所有信息也都将删除（包含问题）</div>
                  </>
                ),
                click: () => fetchFAQSortDel({ id }),
              },
              {
                type: 'edit',
                click: () => handleDataSet('edit', row),
              },
            ]}
          />
        );
      },
    },
  ];

  //  新增 修改
  const handleDataSet = (setType = 'add', initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: faqSortSet({
        dispatch,
        childRef,
        qRef,
        initialValues,
        setType,
      }),
    });
  };

  // 删除
  const fetchFAQSortDel = (payload) => {
    dispatch({
      type: 'serviceFAQ/fetchFAQSortDel',
      payload,
      callback: () => {
        // 列表刷新
        childRef.current.fetchGetData();
        // 外围列表刷新
        qRef.current.fetchGetData();
      },
    });
  };

  return (
    <Modal
      title={'分类管理'}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={setVisible}
    >
      <DataTableBlock
        btnExtra={
          <Button className="dkl_green_btn" onClick={() => handleDataSet()}>
            新增分类
          </Button>
        }
        cRef={childRef}
        CardNone={false}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(row) => `${row.questionCategoryIdString}`}
        dispatchType="serviceFAQ/fetchFAQSortList"
        componentSize="middle"
        {...sortList}
      ></DataTableBlock>
    </Modal>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  sortList: serviceFAQ.sortList,
  loading:
    loading.effects['serviceFAQ/fetchFAQSortList'] || loading.effects['serviceFAQ/fetchFAQSortDel'],
}))(FAQSortList);
