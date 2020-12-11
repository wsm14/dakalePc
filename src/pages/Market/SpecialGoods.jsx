import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import { SPECIAL_STATUS, SPECIAL_RECOMMEND_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import SpecialGoodsTrade from './components/SpecialGoods/SpecialGoodsTrade';

const SpecialGoods = (props) => {
  const { specialGoods, loading, loadings, hubData, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

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
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '商家名称',
      name: 'merchantName',
    },
    {
      label: '上架状态',
      name: 'status',
      type: 'select',
      select: { list: SPECIAL_STATUS },
    },
    {
      label: '推荐状态',
      name: 'recommendStatus',
      type: 'select',
      select: { list: SPECIAL_RECOMMEND_STATUS },
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length && fetchGetHubSelect(val[2]),
    },
    {
      label: '商圈',
      name: 'businessHubId',
      type: 'select',
      loading: loadings.models.baseData,
      allItem: false,
      select: {
        list: hubData.map((item) => ({
          name: item.businessHubName,
          value: item.businessHubIdString,
        })),
      },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品图片',
      fixed: 'left',
      dataIndex: 'goodsImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称',
      fixed: 'left',
      dataIndex: 'goodsName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '售价',
      align: 'right',
      dataIndex: 'realPrice',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '原价',
      align: 'right',
      dataIndex: 'oriPrice',
      render: (val) => `￥ ${val}`,
    },
    {
      title: '已售',
      align: 'right',
      dataIndex: 'soldGoodsCount',
    },
    {
      title: '剩余',
      align: 'right',
      dataIndex: 'maxBuyAmount',
      render: (val, row) => val - row.soldGoodsCount,
    },
    {
      title: '所属商家',
      dataIndex: 'merchantName',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '活动有效期',
      align: 'center',
      dataIndex: 'useStartTime',
      render: (val, row) => `${val} ~ ${row.useEndTime}`,
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => SPECIAL_STATUS[val],
    },
    {
      title: '首页推荐',
      align: 'center',
      dataIndex: 'recommendStatus',
      render: (val) => SPECIAL_RECOMMEND_STATUS[val],
    },
    {
      title: '操作',
      dataIndex: 'specialGoodsId',
      align: 'right',
      fixed: 'right',
      render: (val, record) => {
        const {
          goodsIdString: goodsIdStr,
          businessHubIdString: businessHubId = '',
          specialGoodsId,
        } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'own',
                pop: true,
                title: '下架',
                visible: record.status != '0',
                click: () => fetchSpecialGoodsStatus({ ...record, goodsIdStr }),
              },
              {
                type: 'own',
                title: '推荐',
                visible: record.status != '0' && record.recommendStatus == '0' && businessHubId,
                click: () => fetchGetHubName({ specialGoodsId, businessHubId, recommendStatus: 1 }),
              },
              {
                type: 'own',
                pop: true,
                title: '取消推荐',
                visible: record.status != '0' && record.recommendStatus == '1' && businessHubId,
                click: () => fetchSpecialGoodsRecommend({ specialGoodsId, recommendStatus: 0 }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 获取所属商圈
  const fetchGetHubName = (payload) => {
    dispatch({
      type: 'baseData/fetchGetHubName',
      payload,
      callback: (hub) =>
        Modal.confirm({
          title: `是否推荐至 ${hub.businessHubName}`,
          maskClosable: true,
          onOk() {
            fetchSpecialGoodsRecommend({ ...payload, recommendStatus: 1 });
          },
          onCancel() {},
        }),
    });
  };

  // 下架
  const fetchSpecialGoodsStatus = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 推荐状态
  const fetchSpecialGoodsRecommend = (payload) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsRecommend',
      payload,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 行业类目
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 勾选的行业列表
  const fetchGetTradeSelect = () => {
    dispatch({
      type: 'baseData/fetchGetTradeSelect',
      callback: (detail) => setVisible({ show: true, detail: { categoryIds: detail } }),
    });
  };

  useEffect(() => {
    fetchTradeList();
  }, []);

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        btnExtra={
          <Button className="dkl_green_btn" onClick={fetchGetTradeSelect}>
            行业设置
          </Button>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></DataTableBlock>
      <SpecialGoodsTrade
        visible={visible}
        onCancel={() => setVisible({ show: false })}
      ></SpecialGoodsTrade>
    </>
  );
};

export default connect(({ specialGoods, baseData, loading }) => ({
  specialGoods,
  hubData: baseData.hubData,
  loading: loading.models.specialGoods,
  loadings: loading,
}))(SpecialGoods);
