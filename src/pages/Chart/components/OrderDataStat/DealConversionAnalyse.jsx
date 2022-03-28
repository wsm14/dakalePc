import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin, Cascader } from 'antd';
import CITY from '@/common/city';
import moment from 'moment';
import SearchBlock from '../SearchBlock';
import buyAddPayImg from './img/buyAddPay.png';
import cancelImg from './img/cancel.png';
import refundImg from './img/refund.png';
import styles from './style.less';

const DealConversionAnalyse = ({ moneyData, dispatch, loading }) => {
  const [data, setData] = useState({
    subStatisticType: 'specialGoods',
    statisticType: 'orderConvertAnalysis',
    startStatisticDay: moment().subtract(7, 'day').format('YYYY-MM-DD'),
    endStatisticDay: moment().subtract(1, 'day').format('YYYY-MM-DD'),
  });
  const [city, setCity] = useState([]);

  // 监听数据变化发送请求
  useEffect(() => {
    dispatch({
      type: 'orderDataStat/fetchOrderConvertAnalysisReport',
      payload: data,
    });
  }, [data]);

  return (
    <div style={{ paddingTop: 25, minHeight: 570 }}>
      <SearchBlock
        data={data}
        setData={setData}
        btnObj={
          city.length !== 0
            ? {
                specialGoods: '特惠商品',
                reduceCoupon: '抵扣券',
              }
            : {
                specialGoods: '特惠商品',
                reduceCoupon: '抵扣券',
                commerceGoods: '电商商品',
                channelGoods: '渠道商品',
              }
        }
        btnObjKeyName="subStatisticType"
        timeDayMonthOk={false}
        allText={
          <Cascader
            value={city}
            options={CITY.map((item) => ({
              ...item,
              children: item.children.map((citem) => ({ ...citem, children: undefined })),
            }))}
            onChange={(val) => {
              setCity(val || []);
              if (val === undefined) {
                setData((old) => ({ ...old, cityCode: undefined }));
              } else if (['commerceGoods', 'channelGoods'].includes(data.subStatisticType)) {
                setData((old) => ({ ...old, cityCode: val[1], subStatisticType: 'specialGoods' }));
              }
            }}
            placeholder="请选择地区"
          />
        }
      ></SearchBlock>
      {/* 图表 */}
      <Spin spinning={loading}>
        {/* 下单和支付订单盒子 */}
        <div style={{ display: 'flex', marginTop: 20 }}>
          <div className={styles.box} style={{ marginRight: -1 }}>
            <div className={styles.rowBox} style={{ backgroundColor: '#F2FAEB' }}>
              <div className={styles.box}>
                <div className={styles.marBox}>下单数</div>
                <div>{moneyData?.placeOrder?.totalOrderAmount}</div>
              </div>
              <div className={styles.box}>
                <div className={styles.marBox}>下单金额</div>
                <div>{moneyData?.placeOrder?.totalOrderMoney}</div>
              </div>
              <div className={styles.box}></div>
            </div>
            <div className={styles.rowBox} style={{ backgroundColor: '#FDF5EB' }}>
              <div className={styles.box}>
                <div className={styles.marBox}>支付订单数</div>
                <div>{moneyData?.paidOrder?.totalOrderAmount}</div>
              </div>
              <div className={styles.box}>
                <div className={styles.marBox}>支付金额</div>
                <div>{moneyData?.paidOrder?.totalOrderMoney}</div>
              </div>
              <div
                className={styles.box}
                style={{ marginTop: 50 }}
              >{`订单均价：${moneyData?.paidAverage}`}</div>
            </div>
          </div>
          <img src={buyAddPayImg} />
          <div>
            <div style={{ width: 105, marginTop: 90, textAlign: 'center' }}>下单-支付转化率</div>
            <div>{moneyData?.payPercent}</div>
          </div>
        </div>
        {city.length === 0 && (
          <>
            {/* 核销盒子 */}
            <div style={{ display: 'flex', marginTop: 5 }}>
              <div
                className={styles.box}
                style={{
                  marginRight: -1,
                  display: 'flex',
                  backgroundColor: '#EFFAFA',
                  paddingLeft: 10,
                }}
              >
                <div className={styles.box}>
                  <div className={styles.marBox}>核销数</div>
                  <div>{moneyData?.verificationOrder?.totalOrderAmount}</div>
                </div>
                <div className={styles.box}>
                  <div className={styles.marBox}>核销金额</div>
                  <div>{moneyData?.verificationOrder?.totalOrderMoney}</div>
                </div>
                <div className={styles.box}></div>
              </div>
              <img src={cancelImg} />
              <div style={{ width: 105 }}></div>
            </div>
            {/* 退款盒子 */}
            <div style={{ display: 'flex', marginTop: 5 }}>
              <div
                className={styles.box}
                style={{
                  marginRight: -1,
                  display: 'flex',
                  backgroundColor: '#FEEEF1',
                  paddingLeft: 10,
                }}
              >
                <div className={styles.box}>
                  <div className={styles.marBox}>退款数</div>
                  <div>{moneyData?.refundOrder?.totalOrderAmount}</div>
                </div>
                <div className={styles.box}>
                  <div className={styles.marBox}>退款金额</div>
                  <div>{moneyData?.refundOrder?.totalOrderMoney}</div>
                </div>
                <div className={styles.box}></div>
              </div>
              <img src={refundImg} />
              <div style={{ width: 105 }}></div>
            </div>
          </>
        )}
      </Spin>
    </div>
  );
};

export default connect(({ orderDataStat, loading }) => ({
  moneyData: orderDataStat.moneyData,
  loading: loading.effects['orderDataStat/fetchOrderConvertAnalysisReport'],
}))(DealConversionAnalyse);
