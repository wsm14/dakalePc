import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import PreferentialDrawer from './components/Preferential/PreferentialDrawer';

const PreferentialActive = (props) => {
  const { ordersList, loading, dispatch, hubData, loadings, tabkey } = props;

  const childRef = useRef();
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [visible, setVisible] = useState({ type: 'add', show: false }); // 弹窗

  // 获取商圈
  const fetchGetHubSelect = (districtCode) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload: {
        districtCode,
      },
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '活动状态',
      name: 'orderSn',
    },
    {
      label: '活动有效期',
      type: 'rangePicker',
      name: 'orderTimeStart',
      end: 'orderTimeEnd',
    },
    {
      label: '使用有效期',
      name: 'userType',
      type: 'select',
      allItem: false,
      select: ['领取后', '固定时间'],
      handle: (form) => ({
        onChange: (val) => {
          setSearchType(val);
          form.setFieldsValue({ time: undefined });
        },
      }),
    },
    {
      label: '有效期',
      name: 'time',
      disabled: !searchType,
      type: ['number', 'rangePicker'][searchType],
    },
    {
      label: '集团/店铺名称',
      name: 'goodsName',
    },
    {
      label: '推荐状态',
      name: 'gssoodsName',
    },
    {
      label: '活动商品名称',
      name: 'gme',
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
    {
      label: '店铺类型',
      name: 'ordsserSn',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品图片',
      fixed: 'left',
      dataIndex: 'orderSn',
    },
    {
      title: '商品类型',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '商品名称',
      fixed: 'left',
      dataIndex: 'totalFee',
    },
    {
      title: '商品原价',
      align: 'right',
      dataIndex: 'beanFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '结算价',
      align: 'right',
      dataIndex: 'payFee',
      render: (val) => `￥${val}`,
    },
    {
      title: '发行量',
      align: 'right',
      dataIndex: 'businessArea',
    },
    {
      title: '销量',
      align: 'right',
      dataIndex: 'createTime',
    },
    {
      title: '剩余可售数',
      align: 'right',
      dataIndex: 'merchantName',
    },
    {
      title: '核销数量',
      align: 'right',
      dataIndex: 'orderId',
    },
    {
      title: '店铺类型',
      align: 'center',
      dataIndex: 'orderIsd',
    },
    {
      title: '店铺/集团名称',
      align: 'center',
      dataIndex: 'ordderId',
    },
    {
      title: '活动店铺数',
      align: 'right',
      dataIndex: 'oraderId',
      render: (val) => (val ? <a>{val}</a> : '--'),
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'oradedrId',
    },
    {
      title: '使用有效期',
      align: 'center',
      dataIndex: 'oradaedrId',
    },
    {
      title: '更新人',
      align: 'center',
      dataIndex: 'oradeddrId',
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'oradeddrIdd',
    },
    {
      title: '是否推荐',
      align: 'center',
      dataIndex: 'orsIdd',
    },
    {
      title: '活动状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'orIfdd',
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'right',
      dataIndex: 'orIddd',
      render: (val, record) => {
        const { status, userMomentIdString } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'down', // 下架
                visible: status == 1 || status == 5,
                click: () => setVisibleDown({ show: true, initialValues: record }),
              },
              {
                type: 'info', // 详情
                click: () => fetchShareDetail(userMomentIdString, record.contentType || 'video'),
              },
              {
                type: 'edit', // 编辑
                click: () => fetchShareHandleDetail(userMomentIdString),
              },
              {
                type: 'del', // 删除
                click: () => fetchShareHandleDetail(userMomentIdString),
              },
              {
                auth: 'recommendStatus', // 推荐状态
                title: '推荐', // 推荐 | 取消推荐
                click: () => fetchShareHandleDetail(userMomentIdString),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        keepData
        btnExtra={
          <AuthConsumer auth="save">
            <Button
              className="dkl_green_btn"
              onClick={() => setVisible({ type: 'add', show: true })}
            >
              新增
            </Button>
          </AuthConsumer>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ goodsOrScanFlag: tabkey }}
        rowKey={(record) => `${record.orderSn}`}
        dispatchType="ordersList/fetchGetList"
        {...ordersList}
      ></TableDataBlock>
      <PreferentialDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible({ show: false })}
      ></PreferentialDrawer>
    </>
  );
};

export default connect(({ ordersList, baseData, loading }) => ({
  loadings: loading,
  ordersList,
  hubData: baseData.hubData,
  loading: loading.effects['ordersList/fetchGetList'],
}))(PreferentialActive);
