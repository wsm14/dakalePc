import React, { useRef } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import ExcelButton from '@/components/ExcelButton';

const SaleAchievement = (props) => {
  const { saleAchievement, loading, selectList, loadingMre, dispatch } = props;

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
      type: 'select',
      loading: loadingMre,
      placeholder: '请输入店铺名称搜索',
      select: selectList,
      onSearch: (val) => fetchClassifyGetMre(val),
    },
    {
      label: 'BD名称',
      name: 'mobile',
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
      render: (val) => (
        <Ellipsis length={10} tooltip lines={3}>
          {val}
        </Ellipsis>
      ),
    },
    // {
    //   title: '经营类目',
    //   dataIndex: 'contentType',
    //   render: (val) => (val == 'video' ? '视频' : '图片'),
    // },
    {
      title: '所属区域',
      dataIndex: 'provinceName',
      width: 150,
      render: (val, row) => `${val} - ${row.cityName} - ${row.districtCode}`,
    },
    // {
    //   title: '所属商圈',
    //   dataIndex: 'username',
    // },
    // {
    //   title: '归属BD',
    //   align: 'center',
    //   dataIndex: 'level',
    // },
    {
      title: '扫码付金额',
      align: 'right',
      fixed: 'right',
      dataIndex: 'scan',
      render: (val) => <a>{val}</a>,
    },
    {
      title: '核销销售额',
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

  // 搜索店铺
  const fetchClassifyGetMre = debounce((merchantName) => {
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
      payload: {
        limit: 50,
        page: 1,
        bankStatus: 3,
        businessStatus: 1,
        merchantName,
      },
    });
  }, 500);

  return (
    <TableDataBlock
      order
      btnExtra={({ get }) => (
        <ExcelButton
          dispatchType={'saleAchievement/fetchGetExcel'}
          dispatchData={get()}
          exportProps={{
            header: getColumns,
            fieldRender: { merchantName: (val) => val, address: (val) => val },
          }}
        ></ExcelButton>
      )}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.kolMomentsId}`}
      dispatchType="saleAchievement/fetchGetList"
      {...saleAchievement}
    ></TableDataBlock>
  );
};

export default connect(({ saleAchievement, businessList, loading }) => ({
  saleAchievement,
  selectList: businessList.selectList,
  loading: loading.effects['saleAchievement/fetchGetList'],
  loadingMre: loading.models.businessList,
}))(SaleAchievement);
