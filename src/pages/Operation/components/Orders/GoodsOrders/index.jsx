import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { ORDERS_STATUS, ORDERS_TYPE, ORDER_CLOSE_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import PopImgShow from '@/components/PopImgShow';
import { Tag } from 'antd';
import Ellipsis from '@/components/Ellipsis';

const GoodsOrders = (props) => {
  const { ordersList, loading, dispatch, hubData, loadings, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);

  const childRef = useRef();

  // 获取商圈
  const fetchGetHubSelect = (districtCode) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload: {
        districtCode,
      },
    });
  };

  //详情
  const fetchGoodsDetail = (index) => {
    const { orderId } = list[index];
    dispatch({
      type: 'ordersList/fetchOrderDetail',
      payload: { orderId },
      callback: (detail) => {
        setVisible({
          index,
          show: true,
          detail,
        });
      },
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '店铺名',
      name: 'merchantName',
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
      label: '状态',
      name: 'status',
      type: 'select',
      select: ORDERS_STATUS,
    },
    // {
    //   label: '订单关闭类型',
    //   name: 'closeType',
    //   type: 'select',
    //   select: ORDER_CLOSE_TYPE,
    // },
    {
      label: '下单日期',
      type: 'rangePicker',
      name: 'orderTimeStart',
      end: 'orderTimeEnd',
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
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    },
    {
      label: '商圈',
      name: 'businessHubIdStr',
      type: 'select',
      loading: loadings.models.baseData,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品',
      dataIndex: 'orderSn',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <div>
            <PopImgShow url={''} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tag color="magenta">单品</Tag>
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>

            <div style={{ marginTop: 5 }}>订单号：{val}</div>
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
          <div>账号:{row.mobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">单品</Tag>
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
      dataIndex: 'mobile',
      render: (val, row) => '--',
    },
    {
      title: '单价/数量',
      dataIndex: 'payFee',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>222</div>
          <div>22222</div>
          <div>{row.goodsCount ? `×${row.goodsCount}` : ''}</div>
        </div>
      ),
    },

    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'payFee',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${val}`}</div>
          <div>{+record.beanFee ? `(${record.beanFee}卡豆` : '(' + '0卡豆'}</div>
          <div>{(record.beanFee ? `+ ￥${(val - record.beanFee / 100).toFixed(2)}` : '+￥' + val) + ')'}</div>
        </div>
      ),
    },
    {
      title: '商户实收',
      align: 'center',
      dataIndex: 'actualCashFee',
      render: (val, record) =>
        `￥${val}（含${record.actualBeanFee ? record.actualBeanFee : 0}卡豆）`,
    },

    {
      title: '下单/核销时间',
      dataIndex:'createTime',
      align: 'center',
      render:(val,row)=>(
        <div style={{textAlign:'center'}}>
          <div>{val}</div>
          <div>已核销：{row.verificationCount}</div>
          <div>{row.verificationTime}</div>
        </div>
      )
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val,row) => (
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',marginBottom:5}}>{ORDERS_STATUS[val]}  <Tag color="green" style={{marginLeft:5}}>{row.orderSource}</Tag></div>
          <span>{ORDER_CLOSE_TYPE[row.closeType]}</span>
        </div>
      ),
    },
    // {
    //   title: '下单渠道',
    //   align: 'center',
    //   dataIndex: 'orderSource',
    // },
    // {
    //   title: '区域',
    //   align: 'center',
    //   dataIndex: 'provinceName',
    //   render: (val, record) => `${val}-${record.cityName}-${record.districtName}`,
    // },

    // {
    //   title: '订单属性',
    //   align: 'center',
    //   dataIndex: 'orderType',
    //   render: (val) => ORDERS_TYPE[val],
    // },
   
    // {
    //   title: '订单关闭类型',
    //   align: 'center',
    //   dataIndex: 'closeType',
    //   // hidden:
    //   render: (val) => ORDER_CLOSE_TYPE[val],
    // },
    {
      type: 'handle',
      dataIndex: 'orderId',
      render: (val, record, index) => [
        {
          type: 'info',
          click: () => fetchGoodsDetail(index),
        },
      ],
    },
  ];

  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'ordersList/fetchOrdersImport',
      data: { ...get(), goodsOrScanFlag: tabkey },
      exportProps: {
        header: getColumns.slice(0, -1),
        fieldRender: { merchantName: (val) => val, goodsName: (val) => val },
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ goodsOrScanFlag: tabkey }}
        rowKey={(record) => `${record.orderSn}`}
        dispatchType="ordersList/fetchGetList"
        {...ordersList}
      ></TableDataBlock>
      <OrderDetailDraw
        visible={visible}
        total={list.length}
        onClose={() => setVisible(false)}
        getDetail={fetchGoodsDetail}
      ></OrderDetailDraw>
    </>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  hubData: baseData.hubData,
  loading: loading.effects['ordersList/fetchGetList'],
}))(GoodsOrders);
