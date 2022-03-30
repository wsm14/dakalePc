import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { FRANCHISE_COOPERATION_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import FranchiseDrawer from './components/Franchise/FranchiseDrawer';
import { checkCityName } from '@/utils/utils';

const tabList = [
  {
    key: '0',
    tab: '未处理',
  },
  {
    key: '1',
    tab: '已处理',
  },
];

const FranchiseApplication = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();

  const [tabKey, setTabKey] = useState('0');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ handled: tabKey });
  }, [tabKey]);

  // 搜索参数
  const searchItems = [
    {
      label: '申请人',
      name: 'username',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '合作意向类型',
      name: 'cooperationType',
      type: 'select',
      select: FRANCHISE_COOPERATION_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '姓名',
      align: 'center',
      fixed: 'left',
      dataIndex: 'name',
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'phoneNumber',
    },
    {
      title: '意向合作类型',
      align: 'center',
      dataIndex: 'cooperationType',
      render: (val) => FRANCHISE_COOPERATION_TYPE[val],
    },
    {
      title: '意向合作城市',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val, row) => checkCityName(val || row.cityCode || row.provinceCode),
    },
    {
      title: '公司',
      align: 'right',
      dataIndex: 'companyName',
    },
    {
      title: '地址',
      align: 'right',
      dataIndex: 'address',
    },
    {
      title: '邮箱',
      align: 'right',
      dataIndex: 'email',
    },
    {
      title: '申请时间',
      align: 'right',
      dataIndex: 'createTime',
    },
    {
      type: 'handle',
      dataIndex: 'userApplyIdString',
      render: (val, record) => [
        {
          type: 'handle',
          visible: record.handled === '0',
          click: () => setVisible({ type: 'handle', shwo: true, detail: record }),
        },
        {
          type: 'info',
          visible: record.handled === '1',
          click: () => fetchFranchiseHandle(val),
        },
      ],
    },
  ];

  // 获取公司详情
  const fetchFranchiseHandle = (userApplyId) => {
    dispatch({
      type: 'franchiseApp/fetchFranchiseHandleDetail',
      payload: { userApplyId },
      callback: (detail) => setVisible({ type: 'info', shwo: true, detail }),
    });
  };

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
        }}
        order
        
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userApplyIdString}`}
        params={{ handled: tabKey }}
        dispatchType="franchiseApp/fetchGetList"
        {...list}
      ></TableDataBlock>
      <FranchiseDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></FranchiseDrawer>
    </>
  );
};

export default connect(({ franchiseApp, loading }) => ({
  list: franchiseApp.list,
  loading: loading.models.franchiseApp,
}))(FranchiseApplication);
