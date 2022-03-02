import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Spin, Tag } from 'antd';
import debounce from 'lodash/debounce';
import { checkCityName } from '@/utils/utils';
import { WITHDRAW_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import WithdrawRemark from './WithdrawRemark';
import excelProps from './ExcelProps';

const AllianceList = (props) => {
  const { withdrawDetail, loading, dispatch, tabkey, loadings } = props;

  const { allianceTotalData } = withdrawDetail;

  const toatlLoading = loading.effects['withdrawDetail/fetchListCityPartnerWithdrawalTotal'];

  const childRef = useRef();

  const [selectList, setSelectList] = useState([]); // 搜索的公司名称
  const [visible, setVisible] = useState(false); // 修改弹窗
  const [searchTime, setSearchTime] = useState([
    moment().subtract(1, 'month').format('YYYY-MM-DD'),
    moment().format('YYYY-MM-DD'),
  ]); // 显示当前数据的时间标记

  useEffect(() => {
    fetchWithdrawExpertTotal();
    childRef.current.fetchGetData();
  }, [tabkey]);

  // 搜索公司名称
  const fetchGetSearch = debounce((content) => {
    if (!content) return;

    const type = {
      city: 'baseData/fetchGlobalListCity',
      partner: 'baseData/fetchGlobalListPartner',
    }[tabkey];

    const name = {
      city: 'companyName',
      partner: 'partnerName',
    }[tabkey];

    dispatch({
      type,
      payload: {
        limit: 999,
        page: 1,
        [`${name}`]: content,
      },
      callback: setSelectList,
    });
  }, 500);

  // 搜索参数
  const searchItems = [
    {
      label: '提现日期',
      type: 'rangePicker',
      name: 'withdrawalDateStart',
      end: 'withdrawalDateEnd',
    },
    {
      label: '企业名称',
      name: 'userId',
      type: 'select',
      select: selectList,
      loading: loadings,
      onSearch: (val) => fetchGetSearch(val),
      placeholder: '请输入企业名称',
      allItem: false,
      fieldNames: { label: 'label', value: 'value' },
    },
    {
      label: '提现单号',
      name: 'withdrawalSn',
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '提现日期',
      fixed: 'left',
      dataIndex: 'withdrawalDate',
    },
    {
      title: '提现单号',
      fixed: 'left',
      dataIndex: 'withdrawalSn',
    },
    {
      title: '企业名称',
      dataIndex: 'subjectName',
    },
    {
      title: '省市区',
      dataIndex: 'districtCode',
      render: (val, row) => checkCityName(val || row.cityCode || row.provinceCode),
    },
    {
      title: '提现账户',
      align: 'center',
      dataIndex: 'withdrawalAccount',
      render: (val, row) => `${row.withdrawalChannelName}\n${val}`,
    },
    {
      title: '提现账户类型',
      align: 'center',
      dataIndex: 'withdrawalChannelType',
      render: (val) => '现金账户',
    },
    {
      title: '提现金额',
      align: 'right',
      dataIndex: 'withdrawalFee',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '实收提现手续费',
      align: 'right',
      dataIndex: 'withdrawalHandlingFee',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '状态',
      align: 'right',
      fixed: 'right',
      dataIndex: 'status',
      render: (val) => WITHDRAW_STATUS[val],
    },
  ];

  // 统计数据
  const fetchWithdrawExpertTotal = (payload = {}) => {
    const {
      withdrawalDateEnd = moment().format('YYYY-MM-DD'),
      withdrawalDateStart = moment().subtract(1, 'month').format('YYYY-MM-DD'),
    } = payload;
    setSearchTime([withdrawalDateStart, withdrawalDateEnd]);
    dispatch({
      type: 'withdrawDetail/fetchListCityPartnerWithdrawalTotal',
      payload: {
        ...payload,
        userType: tabkey,
      },
    });
  };

  // 导出excel按钮
  const excelBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'withdrawDetail/fetchListCityPartnerWithdrawalExport',
      data: get(),
      exportProps: excelProps,
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        firstFetch={false}
        content={
          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Tag color="orange">
              {searchTime[0]} ~ {searchTime[1]}
            </Tag>
            合计提现金额：
            {toatlLoading ? <Spin></Spin> : `￥${allianceTotalData.allWithdrawalFeeSum.toFixed(2)}`}
            &nbsp;&nbsp; 成功提现金额：
            {toatlLoading ? <Spin></Spin> : `￥${allianceTotalData.withdrawalFeeSum.toFixed(2)}`}
            &nbsp;&nbsp; 成功提现手续费：
            {toatlLoading ? (
              <Spin></Spin>
            ) : (
              `￥${allianceTotalData.withdrawalHandlingFeeSum.toFixed(2)}`
            )}
          </div>
        }
        cRef={childRef}
        noCard={false}
        btnExtra={excelBtn}
        searchCallback={fetchWithdrawExpertTotal}
        loading={loading.effects['withdrawDetail/fetchListCityPartnerWithdrawal']}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.directWithdrawalId}`}
        params={{ userType: tabkey }}
        dispatchType="withdrawDetail/fetchListCityPartnerWithdrawal"
        {...withdrawDetail.alliancelist}
      ></TableDataBlock>
      <WithdrawRemark
        type={'expert'}
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></WithdrawRemark>
    </>
  );
};

export default connect(({ withdrawDetail, loading }) => ({
  withdrawDetail,
  loading,
  loadings:
    loading.effects['baseData/fetchGlobalListCity'] ||
    loading.effects['baseData/fetchGlobalListPartner'],
}))(AllianceList);
