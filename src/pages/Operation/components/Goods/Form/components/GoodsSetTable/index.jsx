import React, { useState } from 'react';
import numeral from 'numeral';
import { PlusOutlined } from '@ant-design/icons';
import DataTableBlock from '@/components/DataTableBlock';
import FormListContent from '../GoodsGruop';

const GoodsSetTable = ({ form, detail }) => {
  const [formShow, setFormShow] = useState(false);
  const [listData, setListData] = useState([]);

  // table 表头
  const getColumns = [
    {
      title: '单品名称',
      dataIndex: 'goodsName',
      width: 260,
    },
    {
      title: '数量',
      align: 'right',
      dataIndex: 'goodsNum',
      render: (val) => `x ${numeral(val).format('0,0')}`,
    },
    {
      title: '价格',
      align: 'right',
      dataIndex: 'goodsPrice',
      render: (val) => `￥ ${numeral(val).format('0,0.00')}`,
    },
  ];

  const tableCon = (
    <DataTableBlock
      componentSize="small"
      noCard={false}
      columns={getColumns}
      rowKey={(record) => `${record.goodsName}`}
      list={detail || listData}
    ></DataTableBlock>
  );

  return (
    <>
      {detail ? (
        tableCon
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="from_before_tip" style={{ width: '25%', textAlign: 'right' }}>
                套餐内单品：
              </div>
              <div style={{ flex: 1, textAlign: 'right', paddingRight: 25 }}>
                <a onClick={() => setFormShow(true)}>
                  <PlusOutlined /> 添加
                </a>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: '0px 20px 0 40px' }}>{tableCon}</div>
          </div>
          <FormListContent
            pform={form}
            visible={formShow}
            onConfirm={(val) => setListData(val)}
            onClose={() => setFormShow(false)}
          ></FormListContent>
        </>
      )}
    </>
  );
};

export default GoodsSetTable;
