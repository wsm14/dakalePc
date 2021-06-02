import React, { useRef } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { Tag, Badge } from 'antd';
import { ORDERS_TYPE, GOODS_CLASS_TYPE, ORDER_TYPE_PROPS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import coupon from './img/coupon.png';

const VerificationList = (props) => {
  const {
    verificationList,
    userList,
    loading,
    loadingUser,
    dispatch,
    selectList,
    loadingMre,
  } = props;

  const childRef = useRef();

  // 搜索店铺
  const fetchClassifyGetMre = debounce((merchantName) => {
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
      payload: {
        limit: 50,
        page: 1,
        merchantName,
      },
    });
  }, 500);

  // 获取用户搜索
  const fetchGetUser = debounce((username) => {
    if (!username) return;
    dispatch({
      type: 'baseData/fetchGetSelectUserList',
      payload: {
        username,
        limit: 50,
        page: 1,
      },
    });
  }, 500);

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'select',
      loading: loadingUser,
      placeholder: '请输入搜索用户昵称',
      select: userList,
      onSearch: (val) => fetchGetUser(val),
      fieldNames: { label: 'username', value: 'userIdString', tip: 'tipInfo' },
    },
    {
      label: '店铺名',
      name: 'merchantId',
      type: 'select',
      loading: loadingMre,
      placeholder: '请输入店铺名称搜索',
      select: selectList,
      onSearch: (val) => fetchClassifyGetMre(val),
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '订单属性',
      type: 'select',
      name: 'orderType',
      select: ORDERS_TYPE,
    },
    {
      label: '核销日期',
      type: 'rangePicker',
      name: 'verificationTimeStart',
      end: 'verificationTimeEnd',
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  //
  const getColumns = [
    {
      title: '商品',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <div>
            <Badge.Ribbon text={ORDER_TYPE_PROPS[row.orderType]} color="cyan" placement="start">
              <PopImgShow
                url={row.goodsImg || coupon}
                onClick={row.goodsImg ? null : () => {}}
              ></PopImgShow>
            </Badge.Ribbon>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {row.goodsType && row.goodsType !== 'reduce' && (
                <Tag color="magenta">{GOODS_CLASS_TYPE[row.goodsType]}</Tag>
              )}
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>

            <div style={{ marginTop: 5 }}>订单号：{row.orderSn}</div>
          </div>
        </div>
      ),
    },
    {
      title: '店铺',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* //账号 */}
          <div>账号:{row.merchantMobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            {/* <Tag color="magenta"></Tag> */}
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div>{`${row.provinceName}-${row.cityName}-${row.districtName}`}</div>
        </div>
      ),
    },
    {
      title: '下单人',
      dataIndex: 'userMobile',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>{row.userName}</div>
          <div>{val}</div>
        </div>
      ),
    },

    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'verificationTotalFee',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${val}`}</div>
          <div>
            {+record.verificationBeanFee ? `(${record.verificationBeanFee}卡豆` : '(' + '0卡豆'}
          </div>
          <div>{(record.verificationPayFee ? `+ ￥${record.verificationPayFee}` : 0) + ')'}</div>
        </div>
      ),
    },
    {
      title: '商户实收',
      align: 'center',
      dataIndex: 'merchantCash',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${record.merchantTotalBean}`}</div>
          <div>{+record.merchantBean ? `(${record.merchantBean}卡豆` : '(' + '0卡豆'}</div>
          <div>{(val ? `+ ￥${val}` : 0) + ')'}</div>
        </div>
      ),
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'cashCommission',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${
            (val + record.beanCommission ? record.beanCommission / 100 : 0)
              ? (val + record.beanCommission ? record.beanCommission / 100 : 0).toFixed(2)
              : 0
          }`}</div>
          <div>{+record.beanCommission ? `(${record.beanCommission}卡豆` : '(' + '0卡豆'}</div>
          <div>{(val ? `+ ￥${val}` : 0) + ')'}</div>
        </div>
      ),
    },

    {
      title: '下单/核销时间',
      dataIndex: 'verificationTime',
      align: 'center',
    },
    {
      title: '核销码',
      align: 'center',
      dataIndex: 'verificationCode',
    },
  ];

  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'ordersList/fetchOrdersImport',
      data: get(),
      exportProps: {
        header: getColumns.slice(0, -1),
        fieldRender: { merchantName: (val) => val, goodsName: (val) => val },
      },
    },
  ];

  return (
    <TableDataBlock
      keepData
      btnExtra={extraBtn}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.orderSn}`}
      dispatchType="verificationList/fetchVerificationList"
      {...verificationList}
    ></TableDataBlock>
  );
};

export default connect(({ verificationList, baseData, businessList, loading }) => ({
  loadings: loading,
  verificationList,
  userList: baseData.userList,
  loading: loading.effects['verificationList/fetchVerificationList'],
  selectList: businessList.selectList,
  loadingMre: loading.models.businessList,
  loadingUser: loading.effects['baseData/fetchGetSelectUserList'],
}))(VerificationList);
