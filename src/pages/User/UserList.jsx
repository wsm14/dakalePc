import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import { checkCityName } from '@/utils/utils';
import { ACCOUNT_STATUS, REAL_NAME_STATUS, USER_SOURCE, USER_PORT_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import SearchCard from './components/UserList/Search/SearchCard';
import UserDetailShow from './components/UserList/UserDetailShow';
import UserListTotalInfo from './components/UserList/UserTotalInfo';
import UserTotalSpread from './components/UserList/UserTotalSpread';
import VoucherPackage from './components/UserList/VoucherPackage';

const UserListComponent = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  // 城市参数
  const [cityData, setCityData] = useState({});

  const [visible, setVisible] = useState(false); // 用户详情弹窗
  const [visibleCoupon, setVisibleCoupon] = useState(false); // 券包详情弹窗

  // 搜索参数
  const searchItems = [
    {
      label: '注册手机号',
      name: 'mobile',
    },
    {
      label: '豆号',
      name: 'beanCode',
    },
    {
      label: '用户昵称',
      name: 'username',
    },
    {
      label: '用户id',
      name: 'userIdString',
    },
    {
      label: '注册时间',
      type: 'rangePicker',
      name: 'createTimeStart',
      end: 'createTimeEnd',
    },
    {
      label: '认证状态',
      name: 'realNameStatus',
      type: 'select',
      select: REAL_NAME_STATUS,
    },
    {
      label: '用户来源',
      name: 'userSource',
      type: 'select',
      select: USER_SOURCE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '用户ID',
      fixed: 'left',
      dataIndex: 'userIdString',
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
      render: (val) => val || '小程序用户',
    },
    {
      title: '昵称',
      dataIndex: 'username',
    },
    {
      title: '性别',
      align: 'center',
      dataIndex: 'gender',
      render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
    },
    {
      title: '实名认证',
      align: 'center',
      dataIndex: 'realNameStatus',
      render: (val) => REAL_NAME_STATUS[val],
    },
    {
      title: '注册地',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '注册时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '账户状态',
      align: 'center',
      dataIndex: 'ports',
      render: (val) =>
        val.length == 0 ? '正常' : `${val.map((item) => USER_PORT_TYPE[item]).join()}已封停`,
    },
    {
      type: 'handle',
      dataIndex: 'parentUserIdString',
      render: (val, record, index) => [
        {
          type: 'info',
          click: () => fetchUserDetail(index),
        },
        {
          type: 'couponInfo',
          click: () => setVisibleCoupon({ show: true, detail: record }),
        },
      ],
    },
  ];

  useEffect(() => {
    fetchUserChartTotal();
    childRef.current && childRef.current.fetchGetData(cityData);
  }, [cityData]);

  // 获取用户统计
  const fetchUserChartTotal = () => {
    dispatch({
      type: 'userList/fetchUserChartTotal',
      payload: cityData,
    });
  };

  // 获取用户详情
  const fetchUserDetail = (index) => {
    const { userIdString: userId } = list.list[index];
    dispatch({
      type: 'userList/fetchUserDetail',
      payload: { userId },
      callback: (detail) => setVisible({ show: true, index, detail }),
    });
  };

  return (
    <>
      {/* <Card bordered={false} style={{ marginBottom: 16 }}>
        <SearchCard setSearchData={setCityData}></SearchCard>
      </Card> */}
      {/* 用户数统计 */}
      {/* <UserListTotalInfo cityData={cityData}></UserListTotalInfo> */}
      {/* 用户chart统计 */}
      {/* <UserTotalSpread></UserTotalSpread> */}
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        params={cityData}
        searchItems={searchItems}
        rowKey={(record) => `${record.userIdString}`}
        dispatchType="userList/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 详情 */}
      <UserDetailShow
        total={list.list.length}
        childRef={childRef}
        visible={visible}
        getDetail={fetchUserDetail}
        onClose={() => setVisible(false)}
      ></UserDetailShow>
      {/* 券包详情 */}
      <VoucherPackage
        visible={visibleCoupon}
        onClose={() => setVisibleCoupon(false)}
      ></VoucherPackage>
    </>
  );
};

export default connect(({ userList, loading }) => ({
  list: userList.list,
  loading: loading.effects['userList/fetchGetList'] || loading.effects['userList/fetchUserDetail'],
}))(UserListComponent);
