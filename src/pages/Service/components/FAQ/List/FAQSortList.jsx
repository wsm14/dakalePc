import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import FaqSortSet from '../Form/FAQSortSet';

const FAQSortList = (props) => {
  const { sortList, qRef, loading, visible, setVisible, dispatch } = props;

  const [visibleSet, setVisibleSet] = useState(false);

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
  const handleDataSet = (type = 'add', initialValues) => {
    setVisibleSet({
      type,
      initialValues,
      show: true,
    });
  };

  // 删除
  const fetchFAQSortDel = (payload) => {
    dispatch({
      type: 'serviceFAQ/fetchFAQSortDel',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <Modal
        title={'分类管理'}
        width={1150}
        destroyOnClose
        footer={null}
        visible={visible}
        onCancel={setVisible}
        afterClose={() => qRef.current.fetchGetData()} // 外围列表刷新
      >
        <TableDataBlock
          btnExtra={
            <Button className="dkl_green_btn" onClick={() => handleDataSet('add')}>
              新增分类
            </Button>
          }
          cRef={childRef}
          noCard={false}
          loading={loading}
          searchItems={searchItems}
          columns={getColumns}
          rowKey={(row) => `${row.questionCategoryIdString}`}
          dispatchType="serviceFAQ/fetchFAQSortList"
          size="middle"
          {...sortList}
        ></TableDataBlock>
      </Modal>
      <FaqSortSet
        qRef={qRef}
        childRef={childRef}
        visibleSet={visibleSet}
        onClose={() => setVisibleSet(false)}
      ></FaqSortSet>
    </>
  );
};

export default connect(({ serviceFAQ, loading }) => ({
  sortList: serviceFAQ.sortList,
  loading:
    loading.effects['serviceFAQ/fetchFAQSortList'] || loading.effects['serviceFAQ/fetchFAQSortDel'],
}))(FAQSortList);
