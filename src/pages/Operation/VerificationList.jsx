import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag, Badge } from 'antd';
import { ORDERS_TYPE, GOODS_CLASS_TYPE, ORDER_TYPE_PROPS } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import coupon from '@public/coupon.png';
import styles from './style.less';

const VerificationList = (props) => {
  const { verificationList, loading, location } = props;

  const {
    query: { orderSn = '' },
  } = location;

  const childRef = useRef();
  const [merchantId, setMerchantId] = useState();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '店铺',
      name: 'merchantId',
      type: 'merchant',
      onChange: (val) => setMerchantId(val),
    },
    {
      label: '商品/券名称',
      name: 'goodsId',
      type: 'good',
      disabled: !merchantId,
      params: { ownerId: merchantId },
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
  const getColumns = [
    {
      title: '商品',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <Badge.Ribbon text={ORDER_TYPE_PROPS[row.orderType]} color="cyan" placement="start">
          <PopImgShow url={row.goodsImg || coupon} onClick={row.goodsImg ? null : () => {}}>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {row.goodsType && row.goodsType !== 'reduce' && (
                  <Tag color="magenta">{GOODS_CLASS_TYPE[row.goodsType]}</Tag>
                )}
                <Ellipsis length={10} tooltip>
                  {row.goodsName}
                </Ellipsis>
              </div>
              <div style={{ marginTop: 5 }} className={styles.specFont}>
                订单号：{row.orderSn}
              </div>
            </div>
          </PopImgShow>
        </Badge.Ribbon>
      ),
    },
    /**
     * groupIdString 有 merchantIdString 有 为子门店
     * groupIdString 无 merchantIdString 有 为单店
     * groupIdString 有 merchantIdString 无 为集团
     */
    {
      title: '店铺',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* //账号 */}
          <div>账号:{row.merchantMobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">
              {!row.groupIdString
                ? '单店'
                : { true: '子门店', false: '集团' }[!row.merchantIdString]}
            </Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div className={styles.specFont}>{checkCityName(row.districtCode)}</div>
        </div>
      ),
    },
    {
      title: '下单人',
      dataIndex: 'userMobile',
      align: 'center',
      render: (val, row) => `${row.userName}\n${val}\n${row.beanCode}`,
    },
    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'settleTotalFee',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${val}`}</div>
          <div className={styles.fontColor}>
            {record.settleBeanFee ? `(${record.settleBeanFee}卡豆` : '(' + '0卡豆'}
          </div>
          <div className={styles.fontColor}>
            {(record.settlePayFee ? `+ ￥${record.settlePayFee}` : 0) + ')'}
          </div>
        </div>
      ),
    },
    {
      title: '商户实收',
      align: 'center',
      dataIndex: 'settlerCash',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${record.settlerPrice ? record.settlerPrice : 0}`}</div>
          {/* <div className={styles.fontColor}>
            {record.settlerBean ? `(${record.settlerBean}卡豆` : '(' + '0卡豆'}
          </div>
          <div className={styles.fontColor}>{(val ? `+ ￥${val}` : 0) + ')'}</div> */}
        </div>
      ),
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'cashCommission',
      render: (val, record) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${(
              Number(record.beanCommission) / 100 +
              Number(record.cashCommission)
            ).toFixed(2)}`}</div>
            {/* <div className={styles.fontColor}>{`(${record.beanCommission}卡豆`}</div>
            <div className={styles.fontColor}>{`￥${record.cashCommission})`}</div> */}
          </div>
        );
      },
    },
    {
      title: '核销时间',
      dataIndex: 'settleTime',
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
      data: { type: 'verificationList', orderGoodsVerificationObject: get() },
    },
  ];

  return (
    <TableDataBlock
      btnExtra={extraBtn}
      resetSearch={() => setMerchantId()}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      params={{ orderSn }}
      rowKey={(record) => `${record.verificationCode}`}
      dispatchType="verificationList/fetchVerificationList"
      {...verificationList}
    ></TableDataBlock>
  );
};

export default connect(({ verificationList, loading }) => ({
  loadings: loading,
  verificationList,
  loading: loading.effects['verificationList/fetchVerificationList'],
}))(VerificationList);
