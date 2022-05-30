import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { SUBMIT_TYPE, ELECTRICGOODS_STATUS } from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import ExtraButton from '@/components/ExtraButton';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import PreferentialDrawer from './components/ElectricGoods/PreferentialDrawer';
import SpecialGoodDetail from './components/ElectricGoods/SpecialGoodDetail';
import RemainModal from './components/ElectricGoods/Detail/RemainModal';

// tab栏列表
const tabList = [
  {
    key: '0',
    tab: '零售',
  },
  {
    key: '1',
    tab: '批采',
  },
];

const ElectricGoods = (props) => {
  const { list, loading, loadings, dispatch } = props;

  const childRef = useRef();
  const [tabKey, setTabKey] = useState('0'); // tab

  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因
  const [visibleRemain, setVisibleRemain] = useState(false);

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ sellType: tabKey });
  }, [tabKey]);

  useEffect(() => {
    fetchGetGoodsClassify();
  }, []);
  // 获取电商品类目
  const fetchGetGoodsClassify = () => {
    // dispatch({
    //   type: 'baseData/fetchGetHubData',
    //   payload: {
    //     districtCode,
    //   },
    // });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '所属类目',
      name: 'goodsName',
      type: 'select',
      select: [],
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
      name: 'activityStartTime',
      type: 'rangePicker',
      end: 'activityEndTime',
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
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div>
          <div style={{ display: 'flex' }}>
            <Ellipsis length={10} tooltip>
              {row.goodsName}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Ellipsis length={10} tooltip>
              {row.ownerName}
            </Ellipsis>
          </div>
        </div>
      ),
    },
    {
      title: '所属类目/供应商',
      align: 'right',
      dataIndex: 'otherPlatformPrice',
    },
    {
      title: '零售价',
      align: 'right',
      dataIndex: 'otherPlatformPrice',
    },
    {
      title: '佣金',
      align: 'right',
      dataIndex: 'commission',
      render: (val, row) => `￥${val}`,
    },
    // {
    //   title: '原价/售价',
    //   align: 'right',
    //   dataIndex: 'oriPrice',
    //   render: (val, row) => {
    //     const zhe = (Number(row.realPrice) / Number(val)) * 10;
    //     return (
    //       <div>
    //         <div style={{ textDecoration: 'line-through', color: '#999999' }}>
    //           ￥{Number(val).toFixed(2)}
    //         </div>
    //         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    //           <Tag color={'red'}>{`${zhe}`.substring(0, 4)}折</Tag>
    //           <div>￥{Number(row.realPrice).toFixed(2)}</div>
    //         </div>
    //       </div>
    //     );
    //   },
    // },

    {
      title: '剩余库存',
      align: 'right',
      dataIndex: 'remain',
    },
    {
      title: '权重',
      dataIndex: 'weight',
      align: 'center',
    },
    {
      title: '商品状态',
      dataIndex: 'oriPrice',
    },
    {
      title: '最后更新时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${SUBMIT_TYPE[row.creatorType]}--${row.creatorName || ''}`,
    },
    {
      type: 'handle',
      dataIndex: 'specialGoodsId',
      width: 150,
      render: (val, record, index) => {
        const { specialGoodsId, ownerIdString: merchantId, status, deleteFlag } = record;
        return [
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(index, 'info'),
          },
          {
            title: '下架',
            auth: 'down',
            visible: status == '1' && deleteFlag == '1', // 活动中 && 未删除
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: record,
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            type: 'edit',
            visible: ['1'].includes(status) && deleteFlag == '1', // 活动中 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'edit'),
          },
          {
            type: 'again', //重新发布
            visible: ['0'].includes(status) && deleteFlag == '1', // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'again'),
          },
          {
            type: 'againUp', // 再次上架
            title: '编辑',
            visible: ['0'].includes(status) && deleteFlag == '1', // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(index, 'againUp'),
          },
          {
            type: 'diary',
            click: () => fetchGetLogData({ type: 'specialGoods', identificationId: val }),
          },
          {
            title: '调整库存',
            type: 'changeRemain',
            visible: ['1'].includes(status) && deleteFlag == '1',
            click: () => fetAddRemain(specialGoodsId, record.ownerIdString, record.remain),
          },
        ];
      },
    },
  ];

  // 获取日志信息
  const fetchGetLogData = (payload) => {
    dispatch({
      type: 'baseData/fetchGetLogDetail',
      payload,
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
  const fetchSpecialGoodsDetail = () => {};

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
        params={{ sellType: '0' }}
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
      <SpecialGoodDetail
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
      ></SpecialGoodDetail>
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
    </>
  );
};

export default connect(({ electricGoods, baseData, loading }) => ({
  list: electricGoods.list,
  loading: loading.models.electricGoods,
}))(ElectricGoods);
