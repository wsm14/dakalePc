import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import ProceDataForm from './Form/ProceDataForm';

const WithdrawTable = (props) => {
  const [visible, setVisible] = useState(false);
  const childRef = useRef();

  const searchItems = [
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  const getColumns = [
    {
      title: '地区',
      fixed: 'left',
      dataIndex: 'city',
    },
    {
      title: '手续费规则',
      align: 'center',
      dataIndex: 'city',
    },
    {
      title: '生效时间',
      align: 'center',
      dataIndex: 'city',
    },
    {
      title: '最后修改人',
      align: 'center',
      dataIndex: 'city',
    },
    {
      title: '最后修改日期',
      align: 'center',
      dataIndex: 'city',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'city',
      render: (val) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
            },
            {
              type: 'edit',
              title: '日志',
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        keepData
        cardProps={{
          title: '店铺提现手续费规则',
          bordered: false,
          extra: (
            <Button
              type="primary"
              onClick={() =>
                setVisible({
                  type:'add',
                  show: true,
                })
              }
            >
              新增
            </Button>
          ),
        }}
        cRef={childRef}
        //   loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        // rowKey={(record) => `${record.categoryCustomId}`}
        //   dispatchType="classifyManage/fetchGetList"
        //   {...classifyManage}
      ></TableDataBlock>
      {/* 新增，编辑 */}
      <ProceDataForm
        visible={visible}
        onClose={() => setVisible(false)}
        cRef={childRef}
      ></ProceDataForm>
    </>
  );
};
export default WithdrawTable;
