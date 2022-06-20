import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Tag } from 'antd';
import {
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  TAG_COLOR_TYPE,
  SPECIAL_RECOMMEND_TYPE,
  SPECIAL_GOODS_TYPE,
  SPECIAL_SHOW_TYPE,
} from '@/common/constant';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import PreferentialDrawer from './components/SpecialGoods/PreferentialDrawer';
import SpecialGoodDetail from './components/SpecialGoods/SpecialGoodDetail';
import QrCodeShow from './components/SpecialGoods/Detail/QrCodeShow';
import RemainModal from './components/SpecialGoods/Detail/RemainModal';
import ShareImg from './components/SpecialGoods/ShareImg';
import { checkCityName, changeTime } from '@/utils/utils';

const SpecialGoods = (props) => {
  const { specialGoods, loading, loadings, dispatch, list } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因
  const [qrcode, setQrcode] = useState({ url: null, title: '' }); // 商品码
  const [visibleRemain, setVisibleRemain] = useState(false);
  const [visibleShare, setVisibleShare] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '集团/店铺名',
      type: 'merchant',
      name: 'relateId',
    },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: SPECIAL_STATUS,
    },
    {
      label: '商品类别',
      name: 'goodsClass',
      type: 'select',
      allItem: false,
      select: { offline: '特惠商品', selfTour: '自我游' },
    },
    {
      label: '展示类型',
      name: 'displayType',
      type: 'select',
      allItem: false,
      select: SPECIAL_SHOW_TYPE.defaultMode,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品主图',
      dataIndex: 'goodsImg',
      render: (val, row) => <PopImgShow url={val} />,
    },
    {
      title: '商品名称/ID',
      dataIndex: 'goodsName',
      align: 'center',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
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
              <Tag color={TAG_COLOR_TYPE[row.productType]}>{GOODS_CLASS_TYPE[row.productType]}</Tag>
              <Ellipsis length={10} tooltip>
                {val}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex' }}>{row.goodsId}</div>
          </div>
        </div>
      ),
    },
    {
      title: '所属店铺/地区',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
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
              <Tag>{BUSINESS_TYPE[row.relateType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.relateName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex' }}>{checkCityName(row.districtCode)}</div>
          </div>
        </div>
      ),
    },
    {
      title: '商品类别',
      align: 'center',
      dataIndex: 'goodsClass',
      render: (val) => SPECIAL_GOODS_TYPE[val],
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'oriPrice',
      render: (val, row) => {
        const zhe = (Number(row.sellPrice) / Number(val)) * 10;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(val).toFixed(2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tag color={'red'}>{`${zhe}`.substring(0, 4)}折</Tag>
              <div>￥{Number(row.sellPrice).toFixed(2)}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '佣金',
      align: 'right',
      dataIndex: 'commission',
      render: (val) => `￥${val}`,
      sorter: (a, b) => Number(a.commission) - Number(b.commission),
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityStartDate',
      render: (val, row) => (
        <>
          {row.activityTimeRule === 'infinite' ? ` 长期` : `${val} ~ ${row.activityEndDate}`}
          {/* <div>
            {row.deleteFlag === '0'
              ? SPECIAL_RECOMMEND_DELSTATUS[row.deleteFlag]
              : SPECIAL_STATUS[row.status]}
          </div> */}
        </>
      ),
    },
    {
      title: '使用有效期',
      dataIndex: 'useTimeRuleObject',
      render: (val, row) => {
        const { startDate = '', endDate, type, delayDays, activeDays } = val || {};
        if (!type) return '';
        if (type === 'fixed') {
          return startDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },

    {
      title: '剩余库存',
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '最后更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '商品状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => {
        const { activityStartDate, activityEndDate, status } = row;
        let ident = '';
        if (['1'].includes(status) && activityStartDate && activityEndDate) {
          if ([0].includes(changeTime(activityStartDate, activityEndDate))) {
            ident = '(即将开始)';
          }
        }
        return `${SPECIAL_STATUS[val]}${ident}`;
      },
    },
    {
      type: 'handle',
      dataIndex: 'goodsId',
      width: 150,
      render: (val, record, index) => {
        const { goodsId, ownerId, status, stockId, remain, deleteFlag } = record;
        return [
          // {
          //   type: 'goodsCode',
          //   visible: ['1', '2'].includes(status), // '活动中'
          //   click: () =>
          //     fetchSpecialGoodsQrCode({ goodsId }, `${record.ownerName}-${record.goodsName}`, {
          //       goodsId,
          //       merchantId,
          //     }),
          // },
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(record, 'info'),
          },
          {
            title: '下架',
            auth: 'down',
            visible: ['1'].includes(status), // 活动中 && 未删除
            click: () =>
              setVisibleRefuse({
                show: true,
                detail: record,
                formProps: { type: 'down', key: 'offShelfReason' },
              }),
          },
          {
            type: 'edit',
            visible: ['1'].includes(status), // 活动中 && 未删除
            click: () => fetchSpecialGoodsDetail(record, 'edit'),
          },
          {
            type: 'again', //重新发布
            visible: ['0'].includes(status), // 已下架 && 未删除
            click: () => fetchSpecialGoodsDetail(record, 'again'),
          },
          // {
          //   type: 'againUp', // 再次上架
          //   title: '编辑',
          //   visible: ['0'].includes(status), // 已下架 && 未删除
          //   click: () => fetchSpecialGoodsDetail(record, 'againUp'),
          // },
          // {
          //   type: 'diary',
          //   click: () => fetchGetLogData({ type: 'specialGoods', identificationId: val }),
          // },
          {
            title: '调整库存',
            type: 'addRemain',
            visible: ['1'].includes(status),
            click: () => fetAddRemain(stockId, ownerId, remain),
          },
          {
            title: '分享配置',
            type: 'shareImg',
            click: () => fetchShareImg(record),
          },
          {
            type: 'del',
            visible: ['0'].includes(status), // 活动中 && 未删除
            click: () => fetchSpecialGoodsDelete(goodsId, ownerId),
          },
        ];
      },
    },
  ];

  // 分享配置
  const fetchShareImg = (record) => {
    const { goodsId, ownerId, goodsName, relateName } = record;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsShareDetail',
      payload: { goodsId, ownerId },
      callback: (val) => {
        const { shareImg, friendShareImg, recommendReason, customTitle } = val;
        const initialValues = {
          shareImg,
          friendShareImg,
          recommendReason,
          customTitle,
        };
        setVisibleShare({
          show: true,
          goodsName,
          ownerName: relateName,
          goodsId,
          ownerId,
          initialValues,
        });
      },
    });
  };

  // 增加库存
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
    const { goodsId, ownerId } = visibleRefuse.detail;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        goodsId: goodsId,
        ownerId: ownerId,
      },
      callback: () => {
        setVisibleRefuse({ show: false, detail: {} });
        childRef.current.fetchGetData();
      },
    });
  };
  //删除
  const fetchSpecialGoodsDelete = (goodsId, ownerId) => {
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDelete',
      payload: {
        goodsId,
        ownerId,
      },
      callback: () => {
        childRef.current.fetchGetData();
      },
    });
  };

  // 获取详情
  const fetchSpecialGoodsDetail = (record, type) => {
    const {
      goodsId,
      ownerId,
      relateName,
      activityStartDate,
      activityEndDate,
      status: infoStatus,
    } = record;
    // if (type === 'edit') {
    //   dispatch({
    //     type: 'specialGoods/fetchEditCurrentStatus',
    //     payload: {
    //       ownerId: ownerIdString,
    //       ownerServiceId: goodsId,
    //       ownerType,
    //     },
    //     callback: (val) => {
    //       if (val !== '1') {
    //         return;
    //       }
    //     },
    //   });
    // }
    let startDisabled = false;
    if (['1'].includes(infoStatus) && activityStartDate && activityEndDate) {
      if ([0].includes(changeTime(activityStartDate, activityEndDate))) {
        startDisabled = true;
      }
    }

    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { goodsId, ownerId: ownerId, type },
      callback: (val) => {
        const { status } = val;
        const newProps = {
          show: true,
          detail: { ...val, merchantName: relateName },
        };
        if (type == 'info') {
          setVisibleInfo({ status, ...newProps, goodsId, ownerId });
        } else {
          setVisibleSet({ type, startDisabled, ...newProps, goodsId, ownerId, infoStatus });
        }
      },
    });
  };

  const extraBtn = ({ get }) => [
    // {
    //   type: 'excel',
    //   dispatch: 'specialGoods/fetchSpecialGoodsImport',
    //   data: get(),
    //   exportProps: excelProps,
    // },
    {
      auth: 'save',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];
  return (
    <>
      <TableDataBlock
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.goodsId}`}
        dispatchType="specialGoods/fetchGetList"
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
      ></SpecialGoodDetail>
      {/* 下架原因 */}
      <RefuseModal
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse({ show: false, detail: {} })}
        handleUpData={fetchSpecialGoodsStatus}
        loading={loadings.models.specialGoods}
      ></RefuseModal>
      {/* 商品码 */}
      <QrCodeShow {...qrcode} onCancel={() => setQrcode({})}></QrCodeShow>
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

export default connect(({ specialGoods, loading }) => ({
  list: specialGoods.list,
  loading: loading.effects['specialGoods/fetchGetList'],
  loadings: loading,
}))(SpecialGoods);
