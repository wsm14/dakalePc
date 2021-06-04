import React, { useRef } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import TableDataBlock from '@/components/TableDataBlock';

const SaleAchievement = (props) => {
  const { saleAchievement, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '统计时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '店铺',
      name: 'merchantId',
      type: 'merchant',
     
    },
    {
      label: 'BD名称',
      name: 'bdInfo',
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '店铺名称',
      dataIndex: 'merchantName',
      width: 200,
      ellipsis: { lines: 3 },
    },
    {
      title: '经营类目',
      dataIndex: 'topCategoryName',
      render: (val, row) => `${val} / ${row.categoryName}`,
    },
    {
      title: '所属区域',
      dataIndex: 'provinceName',
      render: (val, row) => `${val} - ${row.cityName} - ${row.districtName}`,
    },
    {
      title: '所属商圈',
      dataIndex: 'businessHub',
    },
    {
      title: '归属BD',
      align: 'center',
      dataIndex: 'bdInfo',
    },
    {
      title: '扫码付金额',
      align: 'right',
      fixed: 'right',
      dataIndex: 'scan',
      render: (val) => <a>{val}</a>,
    },
    {
      title: '订单销售额',
      align: 'right',
      fixed: 'right',
      dataIndex: 'verificationFee',
      render: (val) => <a>{val}</a>,
    },
    {
      title: '总金额',
      align: 'right',
      fixed: 'right',
      dataIndex: 'totalFee',
      render: (val) => <a>{val}</a>,
    },
  ];

  const preDate = moment().subtract(1, 'day');

  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'saleAchievement/fetchGetExcel',
      dispatchData: get(),
      exportProps: {
        header: getColumns,
        fieldRender: {
          merchantName: (val) => val,
          scan: (val) => val,
          verificationFee: (val) => val,
          totalFee: (val) => val,
        },
      },
    },
  ];

  return (
    <TableDataBlock
      order
      btnExtra={extraBtn}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      timeParams={{
        time: {
          beginDate: preDate.format('YYYY-MM-DD'),
          endDate: preDate.format('YYYY-MM-DD'),
        },
        show: { beginDate: [preDate, preDate] },
      }}
      rowKey={(record) => `${record.bdInfo + record.merchantId}`}
      dispatchType="saleAchievement/fetchGetList"
      {...saleAchievement}
    ></TableDataBlock>
  );
};

export default connect(({ saleAchievement, loading }) => ({
  saleAchievement,
  loading: loading.effects['saleAchievement/fetchGetList'],
}))(SaleAchievement);
