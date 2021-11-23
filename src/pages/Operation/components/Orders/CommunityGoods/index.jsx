import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { ORDERS_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import OrderDetailDraw from '../OrderDetailDraw';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import coupon from '@public/coupon.png';
import styles from '../style.less';

const CommunityGoods = (props) => {
  const { ordersList, loading, loadings, dispatch, tabkey } = props;
  const { list } = ordersList;

  const [visible, setVisible] = useState(false);
  const [rowKey, setRowKey] = useState([]);
  const childRef = useRef();

  useEffect(() => {
    setRowKey(list.map((item) => item.orderId));
  }, [list]);

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
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '团长',
      name: 'relateOwnerId',
      type: 'user',
      placeholder: '请输入团长昵称、豆号或手机号',
    },

    {
      label: '订单状态',
      name: 'status',
      type: 'select',
      select: ORDERS_STATUS,
    },
    {
      label: '团购信息',
      name: 'title',
    },
    {
      label: '下单日期',
      type: 'rangePicker',
      name: 'orderTimeStart',
      end: 'orderTimeEnd',
    },
  ];

  //table 表头
  const columns = [
    {
      title: '下单时间',
      dataIndex: 'createTime',
    },
    {
      title: '订单号',
      dataIndex: 'orderSn',
    },
    {
      title: '团购信息标题 跟团号',
      dataIndex: 'organizationGoodsOrderDescObject',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {`${val?.title}\n${val?.organizationNumber}`}
        </Ellipsis>
      ),
    },
    {
      title: '团长手机号',
      dataIndex: 'relateOwnerMobile',
    },
    {
      title: '团长昵称',
      dataIndex: 'organizationGoodsOrderDescObject',
      render: (val) => val?.relateOwnerName,
    },
    {
      title: '买家',
      align: 'center',
      dataIndex: 'userMobile',
      render: (val, row) => `${row.userName}\n${val}\n${row.beanCode}`,
    },
    {
      title: '订单状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => ORDERS_STATUS[val],
    },
    {
      title: '用户实收',
      align: 'center',
      dataIndex: 'payFee',
      render: (val, record) => {
        const cashBean = record.beanFee ? record.beanFee / 100 : 0;
        return (
          <div style={{ textAlign: 'center' }}>
            <div>{`￥${record.totalFee}`}</div>
            <div className={styles.fontColor}>
              {record.beanFee ? `(${record.beanFee}卡豆` : '(' + '0卡豆'}
            </div>
            <div className={styles.fontColor}>{(val ? `+ ￥${val}` : 0) + ')'}</div>
          </div>
        );
      },
    },
    {
      type: 'handle',
      align: 'center',
      dataIndex: 'orderId',
      render: (val, row, index) => [
        {
          type: 'info',
          click: () => fetchGoodsDetail(index),
        },
      ],
    },
  ];

  // 展开table 表头
  const getColumns = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (val, row) => {
        const { specificationData = {} } = row;
        const { specificationMap = {} } = specificationData;
        const arrKeys = Object.keys(specificationMap);
        return (
          <PopImgShow url={row.goodsImg || coupon} onClick={row.goodsImg ? null : () => {}}>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Ellipsis length={10} tooltip>
                  {val}
                </Ellipsis>
              </div>
              {arrKeys.length && (
                <div style={{ marginTop: 5 }} className={styles.specFont}>
                  {arrKeys.map(
                    (item, index) =>
                      item !== '' && (
                        <span>{`${item}/${specificationMap[item]}${
                          index + 1 < arrKeys.length ? '，' : ''
                        }`}</span>
                      ),
                  )}
                </div>
              )}
            </div>
          </PopImgShow>
        );
      },
    },
    {
      title: '单价',
      align: 'center',
      dataIndex: 'goodsPrice',
    },
    {
      title: '数量',
      align: 'center',
      dataIndex: 'goodsCount',
    },
    {
      title: '商品状态',
      align: 'center',
      dataIndex: 'remainCount',
      render: (val) => (['0'].includes(val) ? '已核销' : '待核销'),
    },
  ];

  const expandedRowRender = (columns, record) => {
    return (
      <TableDataBlock
        noCard={false}
        pagination={false}
        size="middle"
        tableSize="small"
        columns={columns}
        list={record?.organizationGoodsOrderDescObject?.communityGoodsList || []}
        rowKey={(record) =>
          `${record.communityOrganizationGoodsId}${Math.ceil(Math.random() * 1000) + 1}`
        }
      ></TableDataBlock>
    );
  };

  return (
    <>
      <TableDataBlock
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={columns}
        searchItems={searchItems}
        params={{ orderType: tabkey }}
        rowKey={(record) => `${record.orderId}`}
        dispatchType="ordersList/fetchGetList"
        expandable={{
          expandedRowKeys: rowKey,
          onExpand: (expanded, row) => {
            if (expanded) {
              setRowKey((oldKey) => oldKey.concat(row.orderId));
            } else setRowKey((oldKey) => oldKey.filter((i) => i !== row.orderId));
          },
          expandedRowRender: (record) => expandedRowRender(getColumns, record),
        }}
        {...ordersList}
      ></TableDataBlock>
      {/* 详情 */}
      <OrderDetailDraw
        childRef={childRef}
        visible={visible}
        total={list.length}
        tabkey={tabkey}
        loading={loadings.effects['ordersList/fetchOrderDetail']}
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
  loading: loading.models.ordersList,
}))(CommunityGoods);
