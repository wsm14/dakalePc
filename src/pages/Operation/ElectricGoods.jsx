import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import {
  SUBMIT_TYPE,
  ELECTRICGOODS_STATUS,
  ELECTRICGOODS_SELL_PRICE_TYPE,
} from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import debounce from 'lodash/debounce';
import ExtraButton from '@/components/ExtraButton';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import PreferentialDrawer from './components/ElectricGoods/PreferentialDrawer';
import ElectricGoodDetail from './components/ElectricGoods/ElectricGoodDetail';
import RemainModal from './components/ElectricGoods/Detail/RemainModal';
import ShareImg from './components/ElectricGoods/ShareImg';

// tab栏列表
const tabList = [
  {
    key: 'single',
    tab: '零售',
  },
  {
    key: 'batch',
    tab: '批采',
  },
];

const ElectricGoods = (props) => {
  const { list, loading, dispatch, classifyParentList } = props;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('single'); // tab

  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因
  const [visibleRemain, setVisibleRemain] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false); // 分享配置

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ sellType: tabKey });
  }, [tabKey]);

  useEffect(() => {
    fetchGetGoodsClassify();
  }, []);
  // 获取电商品后台类目
  const fetchGetGoodsClassify = () => {
    dispatch({ type: 'baseData/fetchParentListClassify' });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '商品id',
      name: 'goodsId',
    },
    {
      label: '供应商',
      name: 'supplierName',
    },
    {
      label: '所属类目',
      name: 'categoryId',
      type: 'cascader',
      select: classifyParentList,
      fieldNames: { label: 'classifyName', value: 'classifyId', children: 'childList' },
    },
    {
      label: '商品状态',
      name: 'status',
      type: 'select',
      allItem: false,
      select: ELECTRICGOODS_STATUS,
    },
    {
      label: '最后更新时间',
      name: 'updateStartDate',
      type: 'rangePicker',
      end: 'updateEndDate',
    },
    {
      label: '最后操作人',
      name: 'people',
      placeholder: '请输入姓名',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品主图',
      dataIndex: 'goodsImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称/ID',
      dataIndex: 'goodsName',
      render: (val, row) => (
        <div>
          <div style={{ display: 'flex' }}>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Ellipsis length={10} tooltip>
              {row?.goodsId}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '所属类目/供应商',
      align: 'right',
      dataIndex: 'categoryName',
      render: (val, row) => (
        <div>
          <div style={{ display: 'flex' }}>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Ellipsis length={10} tooltip>
              {row?.relateName}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '售卖价格类型',
      dataIndex: 'paymentModeType',
      render: (val) => ELECTRICGOODS_SELL_PRICE_TYPE[val],
    },
    {
      title: '零售价',
      align: 'right',
      dataIndex: 'sellPriceRange',
    },
    {
      title: '佣金/库存',
      align: 'right',
      dataIndex: 'goodsId',
      render: (val, row) => <Button type="link">查看</Button>,
    },
    {
      title: '剩余库存',
      align: 'right',
      dataIndex: 'remain',
    },
    {
      title: '权重',
      dataIndex: 'rightWeights',
      align: 'center',
      // render: (val, row) => (
      //   <TradeSortSet
      //     detail={row}
      //     onSubmit={fetchTradeSet}
      //     getList={getList}
      //     idName="goodsId"
      //   ></TradeSortSet>
      // ),
    },
    {
      title: '商品状态',
      dataIndex: 'status',
      render: (val) => ELECTRICGOODS_STATUS[val],
    },
    {
      title: '最后更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      render: (val, row) => `${val}\n${SUBMIT_TYPE[row.creatorType]}--${row.creatorName || ''}`,
    },
    {
      type: 'handle',
      dataIndex: 'goodsId',
      width: 150,
      render: (val, record, index) => {
        const { specialGoodsId, ownerIdString: merchantId, status, deleteFlag } = record;
        return [
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(val, 'info'),
          },
          {
            title: '下架',
            auth: 'down',
            // visible: status == '1' && deleteFlag == '1', // 活动中 && 未删除
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: record,
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            type: 'edit',
            // visible: ['1'].includes(status) && deleteFlag == '1', // 活动中 && 未删除
            click: () => fetchSpecialGoodsDetail(val, 'edit'),
          },
          {
            type: 'again', //重新发布
            // visible: ['0'].includes(status) && deleteFlag == '1', // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(val, 'again'),
          },
          {
            type: 'againUp', // 再次上架
            title: '编辑',
            visible: ['0'].includes(status) && deleteFlag == '1', // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(val, 'againUp'),
          },
          // {
          //   type: 'diary', // 日志
          //   click: () => fetchGetLogData({ type: 'specialGoods', identificationId: val }),
          // },
          {
            title: '调整库存',
            type: 'changeRemain',
            // visible: ['1'].includes(status) && deleteFlag == '1',
            click: () => fetAddRemain(specialGoodsId, record.ownerIdString, record.remain),
          },
          {
            title: '设置', // 分享配置
            type: 'shareImg',
            click: () => fetchShareImg(record),
          },
        ];
      },
    },
  ];

  // 获取日志信息
  // const fetchGetLogData = (payload) => {
  //   dispatch({
  //     type: 'baseData/fetchGetLogDetail',
  //     payload,
  //   });
  // };

  // 分享配置
  const fetchShareImg = (record) => {
    setVisibleShare({
      show: true,
    });
  };

  // 调整库存
  const fetAddRemain = (id, ownerId, remain) => {
    setVisibleRemain({
      show: true,
      id,
      ownerId,
      remain,
    });
  };

  // 下架
  const fetchSpecialGoodsStatus = (values) => {
    const { specialGoodsId, ownerIdString } = visibleRefuse.detail;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        id: specialGoodsId,
        ownerId: ownerIdString,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };

  // 获取详情
  const fetchSpecialGoodsDetail = (goodsId, type) => {
    dispatch({
      type: 'electricGoods/fetchGetGoodsForUpdate',
      payload: {
        goodsId,
        ownerId: -1,
      },
      callback: (detail) =>
        type == 'info'
          ? setVisibleInfo({
              show: true,
              detail,
            })
          : '',
    });
  };

  const btnList = [
    {
      auth: 'save',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];
  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          tabBarExtraContent: <ExtraButton list={btnList}></ExtraButton>,
        }}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ sellType: 'single' }}
        rowKey={(record) => `${record.goodsId}`}
        dispatchType="electricGoods/fetchGetList"
        {...list}
      ></TableDataBlock>
      <PreferentialDrawer
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></PreferentialDrawer>
      {/* 详情 */}
      <ElectricGoodDetail
        visible={visibleInfo}
        getDetail={fetchSpecialGoodsDetail}
        onEdit={() =>
          //  活动中的编辑
          setVisibleSet({
            // type: [false, 'active', 'edit'][visibleInfo.status],
            type: 'edit',
            show: true,
            detail: visibleInfo ? visibleInfo.detail : {},
          })
        }
        onClose={() => setVisibleInfo(false)}
      ></ElectricGoodDetail>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchSpecialGoodsStatus}
      ></RefuseModal>
      {/* 库存总量 */}
      <RemainModal
        childRef={childRef}
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></RemainModal>
      {/* 分享配置 */}
      <ShareImg visible={visibleShare} onClose={() => setVisibleShare(false)}></ShareImg>
    </>
  );
};

export default connect(({ electricGoods, baseData, loading }) => ({
  classifyParentList: baseData.classifyParentList,
  list: electricGoods.list,
  loading: loading.models.electricGoods,
}))(ElectricGoods);
