import React, { useRef } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { GOODS_CLASS_TYPE, TAG_COLOR_TYPE } from '@/common/constant';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';

const SpecialGoods = (props) => {
  const { id, specialGoodsList, selectType, handleSelectItem, loading } = props;

  const childRef = useRef();

  const getColumns = [
    {
      title: '类型',
      align: 'center',
      width: 100,
      dataIndex: 'goodsType',
      render: (val) => <Tag color={TAG_COLOR_TYPE[val]}>{GOODS_CLASS_TYPE[val]}</Tag>,
    },
    {
      title: '图片',
      align: 'center',
      width: 100,
      dataIndex: 'goodsImg',
      render: (val) => <PopImgShow width={60} url={val} />,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '活动时间',
      dataIndex: 'activityTimeRule', // 使用有效期-固定时间-开始时间
      render: (val, row) => {
        const { activityStartTime, activityEndTime } = row;
        return { fixed: `${activityStartTime} - ${activityEndTime}`, infinite: '长期' }[val];
      },
    },
    {
      title: '价格',
      align: 'right',
      dataIndex: 'realPrice',
      render: (val, row) => (
        <div>
          <div>¥{val}</div>
          <div
            style={{
              textDecoration: 'line-through',
              color: '#9e9e9e',
            }}
          >
            ¥{row.oriPrice}
          </div>
        </div>
      ),
    },
    {
      title: '库存',
      align: 'right',
      dataIndex: 'remain',
      render: (val) => `剩余${val}张`,
    },
  ];

  return (
    <TableDataBlock
      tableSize="small"
      noCard={false}
      // firstFetch={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      params={{
        merchantId: '1425385024611303425',
        goodsStatus: 1,
      }}
      scroll={{ y: 400 }}
      rowSelection={{
        type: selectType,
        preserveSelectedRowKeys: true,
        getCheckboxProps: (record) => ({
          disabled: record.name === '',
        }),
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys:`, selectedRowKeys, 'selectedRows: ', selectedRows);
          handleSelectItem(selectedRowKeys, selectedRows);
        },
      }}
      rowKey={(row) => `${row.activityGoodsId}`}
      dispatchType="baseData/fetchGetSpecialGoodsSelect"
      {...specialGoodsList}
    ></TableDataBlock>
  );
};

export default connect(({ baseData, loading }) => ({
  specialGoodsList: baseData.specialGoods,
  loading: loading.effects['baseData/fetchGetSpecialGoodsSelect'],
}))(SpecialGoods);
