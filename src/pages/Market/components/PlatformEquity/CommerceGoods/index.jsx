import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { SUBMIT_TYPE, COMMERCEGOODS_STATUS } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import { RefuseModal } from '@/components/PublicComponents';
import TableDataBlock from '@/components/TableDataBlock';
import CommerceGoodsAdd from './components/CommerceGoodsAdd';
import CommerceGoodsDetail from './components/CommerceGoodsDetail';
import RemainModal from './components/Detail/RemainModal';
import QrCodeShow from './components/Detail/QrCodeShow';
import ShareImg from './components/Detail/ShareImg';

/**
 * 电商商品
 */
const PlatformEquityGoods = (props) => {
  const { specialGoods, loading, dispatch } = props;
  const { list } = specialGoods;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因
  const [visibleRemain, setVisibleRemain] = useState(false);
  const [qrcode, setQrcode] = useState({ url: null, title: '' }); // 商品码
  const [visibleShare, setVisibleShare] = useState(false); // 分享配置

  useEffect(() => {
    if (childRef.current) {
      childRef.current.fetchGetData();
    }
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: COMMERCEGOODS_STATUS,
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'createStartTime',
      end: 'createEndTime',
    },
    {
      label: '创建人',
      name: 'creatorName',
    },
    {
      label: '商品ID',
      name: 'goodsId',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品名称/ID',
      fixed: 'left',
      dataIndex: 'goodsImg',
      width: 350,
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              marginLeft: 5,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Ellipsis length={5} lines={2} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ color: '#999', marginTop: 5 }}>ID：{row.activityGoodsId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '商品价值/售价',
      align: 'right',
      dataIndex: 'paymentModeObject',
      render: (val = {}, row) => (
        <div>
          <div style={{ textDecoration: 'line-through', color: '#999999' }}>
            ￥{Number(row.oriPrice).toFixed(2)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              {val.type === 'self'
                ? `${val.bean || 0} 卡豆 + ${val.cash || 0} 元`
                : `${row.realPrice || 0} 元`}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '剩余库存',
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '累计销售',
      align: 'right',
      dataIndex: 'soldGoodsCount',
      sorter: (a, b) => a.soldGoodsCount - b.soldGoodsCount,
    },
    {
      title: '状态',
      align: 'right',
      dataIndex: 'status',
      render: (val) => COMMERCEGOODS_STATUS[val],
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${SUBMIT_TYPE[row.creatorType]}--${row.creatorName || ''}`,
    },
    {
      type: 'handle',
      dataIndex: 'specialGoodsId',
      width: 150,
      render: (val, record, index) => {
        const { specialGoodsId, relateIdString, status, deleteFlag } = record;
        return [
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(index, 'info'),
          },
          {
            type: 'down',
            visible: ['1', '2'].includes(status) && deleteFlag == '1', // 活动中/即将开始 && 未删除
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
          // {
          //   type: 'diary',
          //   click: () => fetchGetLogData({ type: 'specialGoods', identificationId: val }),
          // },
          {
            title: '增加库存',
            type: 'addRemain',
            visible: ['1'].includes(status) && deleteFlag == '1',
            click: () => fetAddRemain(specialGoodsId, record.remain, record.ownerIdString),
          },
          {
            type: 'goodsCode',
            visible: status == '1' && deleteFlag == '1', // 活动中 && 未删除
            click: () =>
              fetchSpecialGoodsQrCode(
                { specialGoodsId },
                `${record.relateName}-${record.goodsName}`,
                { specialGoodsId, merchantId: relateIdString },
              ),
          },
          {
            title: '分享配置',
            type: 'shareImg',
            click: () => fetchShareImg(record),
          },
        ];
      },
    },
  ];

  // 分享配置
  const fetchShareImg = (record) => {
    const { specialGoodsId, ownerIdString, goodsName, ownerName } = record;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, ownerId: ownerIdString },
      callback: (val) => {
        const { shareImg, friendShareImg } = val;
        const initialValues = {
          shareImg,
          friendShareImg,
        };
        setVisibleShare({
          show: true,
          goodsName,
          ownerName,
          specialGoodsId,
          ownerIdString,
          initialValues,
        });
      },
    });
  };

  // 获取商品码
  const fetchSpecialGoodsQrCode = (payload, title, data) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsQrCode',
      payload,
      callback: (url) => setQrcode({ url, title, data }),
    });
  };

  // 获取详情
  const fetchSpecialGoodsDetail = (index, type) => {
    const { specialGoodsId, relateName, relateType, ownerIdString } = list[index];
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, ownerId: ownerIdString, type },
      callback: (val) => {
        const { status } = val;
        const newProps = {
          show: true,
          detail: { ...val, merchantName: relateName, relateType },
        };
        if (type == 'info') {
          setVisibleInfo({ status, index, ...newProps, specialGoodsId });
        } else {
          setVisibleSet({ type, ...newProps });
        }
      },
    });
  };

  // 获取日志信息
  // const fetchGetLogData = (payload) => {
  //   dispatch({
  //     type: 'baseData/fetchGetLogDetail',
  //     payload,
  //   });
  // };

  // 增加库存
  const fetAddRemain = (id, remain, ownerIdString) => {
    setVisibleRemain({
      show: true,
      id,
      remain,
      ownerIdString,
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

  const btnList = [
    {
      auth: 'save',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        //
        btnExtra={btnList}
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ activityType: 'commerceGoods' }}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></TableDataBlock>
      {/* 新增 编辑 */}
      <CommerceGoodsAdd
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></CommerceGoodsAdd>
      {/* 详情 */}
      <CommerceGoodsDetail
        visible={visibleInfo}
        total={list.length}
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
      ></CommerceGoodsDetail>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchSpecialGoodsStatus}
        loading={loading}
      ></RefuseModal>{' '}
      {/* 库存总量 */}
      <RemainModal
        childRef={childRef}
        visible={visibleRemain}
        onClose={() => setVisibleRemain(false)}
      ></RemainModal>
      {/* 商品码 */}
      <QrCodeShow {...qrcode} onCancel={() => setQrcode({})}></QrCodeShow>
      {/* 分享配置 */}
      <ShareImg visible={visibleShare} onClose={() => setVisibleShare(false)}></ShareImg>
    </>
  );
};

export default connect(({ specialGoods, loading }) => ({
  specialGoods,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(PlatformEquityGoods);
