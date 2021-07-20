import React, { useRef } from 'react';
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
  const { verificationList, loading } = props;

  const childRef = useRef();

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
      label: '店铺名',
      name: 'merchantId',
      type: 'merchant',
    },
    {
      label: '商品名称',
      name: 'goodsId',
      type: 'good',
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
    {
      title: '店铺',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* //账号 */}
          <div>账号:{row.merchantMobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">单店</Tag>
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
          <div>{`￥${(record.settlerPrice ? record.settlerPrice / 100 : 0).toFixed(2)}`}</div>
          <div className={styles.fontColor}>
            {record.settlerBean ? `(${record.settlerBean}卡豆` : '(' + '0卡豆'}
          </div>
          <div className={styles.fontColor}>{(val ? `+ ￥${val}` : 0) + ')'}</div>
        </div>
      ),
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'cashCommission',
      render: (val, record) => {
        const mecash = (record.settlerPrice ? record.settlerPrice / 100 : 0).toFixed(2);
        const bean = (Number(record.settleTotalFee) - Number(mecash)).toFixed(2);
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${bean}`}</div>
            <div className={styles.fontColor}>
              {`(${record.settleBeanFee - record.settlerBean}卡豆`}
            </div>
            <div className={styles.fontColor}>
              {`￥${(Number(record.settlePayFee) - Number(record.settlerCash)).toFixed(2)})`}
            </div>
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
      keepData
      btnExtra={extraBtn}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
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
