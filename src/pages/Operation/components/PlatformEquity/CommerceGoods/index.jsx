import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import {
  SUBMIT_TYPE,
  BUSINESS_TYPE,
  SPECIAL_STATUS,
  GOODS_CLASS_TYPE,
  SPECIAL_USERTIME_TYPE,
} from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import { RefuseModal } from '@/components/PublicComponents';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import CommerceGoodsAdd from './components/CommerceGoodsAdd';
import PlatformEquityGoodsDetail from './components/PlatformEquityGoodsDetail';
import RemainModal from './components/Detail/RemainModal';

/**
 * 权益商品
 */
const PlatformEquityGoods = (props) => {
  const { specialGoods, loading, dispatch } = props;
  const { list } = specialGoods;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [searchType, setSearchType] = useState(null); // 搜索类型
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const [visibleRefuse, setVisibleRefuse] = useState({ detail: {}, show: false }); // 审核拒绝 下架原因
  const [visibleRemain, setVisibleRemain] = useState(false);

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
      label: '集团/店铺名',
      name: 'relateId',
      type: 'merchant',
    },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: SPECIAL_STATUS,
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityStartTime',
      end: 'activityEndTime',
      disabledDate: () => false,
    },
    {
      label: '使用有效期',
      type: 'select',
      name: 'useTimeRule',
      allItem: false,
      select: SPECIAL_USERTIME_TYPE,
      handle: (form) => ({
        onChange: (val) => {
          setSearchType(val);
          form.setFieldsValue({ gain: undefined });
        },
      }),
    },
    {
      label: '有效期',
      name: { gain: 'activeDays', fixed: 'useStartTime' }[searchType],
      disabled: !searchType,
      disabledDate: () => false,
      type: { gain: 'number', fixed: 'rangePicker' }[searchType],
      end: 'useEndTime',
    },
    {
      label: '商家所属地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '店铺类型',
      name: 'relateType',
      type: 'select',
      select: BUSINESS_TYPE,
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
  ];

  // table 表头
  const getColumns = [
    {
      title: '商品/店铺名称',
      fixed: 'left',
      dataIndex: 'goodsImg',
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
              <Tag color={row.goodsType === 'single' ? 'orange' : 'magenta'}>
                {GOODS_CLASS_TYPE[row.goodsType]}
              </Tag>
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Tag>{BUSINESS_TYPE[row.relateType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.relateName}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'paymentModeObject',
      render: (val = {}, row) => (
        <div>
          <div style={{ textDecoration: 'line-through', color: '#999999' }}>
            ￥{Number(row.oriPrice).toFixed(2)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              {row.buyFlag === '0' ? '免费' : `${val.bean || 0} 卡豆 + ${val.cash || 0} 元`}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '使用有效期',
      dataIndex: 'useStartTime',
      render: (val, row) => {
        const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
        if (!useTimeRule) return '';
        if (useTimeRule === 'fixed') {
          return useStartTime + '~' + useEndTime;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityStartTime',
      render: (val, row) => (
        <>
          {row.activityTimeRule === 'infinite'
            ? `${row.createTime} ~ 长期`
            : `${val} ~ ${row.activityEndTime}`}
          <div>{SPECIAL_STATUS[row.status]}</div>
        </>
      ),
    },
    {
      title: '剩余数量',
      align: 'right',
      dataIndex: 'remain',
      sorter: (a, b) => a.remain - b.remain,
    },
    {
      title: '下单数量',
      align: 'right',
      dataIndex: 'soldGoodsCount',
      sorter: (a, b) => a.soldGoodsCount - b.soldGoodsCount,
    },
    {
      title: '核销数量',
      align: 'right',
      dataIndex: 'writeOffGoodsCount',
      sorter: (a, b) => a.writeOffGoodsCount - b.writeOffGoodsCount,
    },
    {
      title: '商家所属地区/行业',
      align: 'center',
      dataIndex: 'districtCode',
      render: (val, row) => `${checkCityName(val)}\n${row.topCategoryName}/${row.categoryName}`,
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
        const { specialGoodsId, status, deleteFlag } = record;
        return [
          {
            type: 'info',
            click: () => fetchSpecialGoodsDetail(index, 'info'),
          },
          {
            type: 'down',
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
            title: '增加库存',
            type: 'addRemain',
            visible: ['1'].includes(status) && deleteFlag == '1',
            click: () => fetAddRemain(specialGoodsId, record.remain),
          },
        ];
      },
    },
  ];

  // 获取详情
  const fetchSpecialGoodsDetail = (index, type) => {
    const { specialGoodsId, relateName, relateType } = list[index];
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsDetail',
      payload: { specialGoodsId, ownerId: -1, type },
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
  const fetchGetLogData = (payload) => {
    dispatch({
      type: 'baseData/fetchGetLogDetail',
      payload,
    });
  };

  // 增加库存
  const fetAddRemain = (id, remain) => {
    setVisibleRemain({
      show: true,
      id,
      remain,
    });
  };

  // 下架
  const fetchSpecialGoodsStatus = (values) => {
    const { specialGoodsId } = visibleRefuse.detail;
    dispatch({
      type: 'specialGoods/fetchSpecialGoodsStatus',
      payload: {
        ...values,
        id: specialGoodsId,
        ownerId: -1,
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
        // keepData
        btnExtra={btnList}
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ adminFlag: 1, activityType: 'commerceGoods' }}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></TableDataBlock>
      {/* 新增 编辑 详情*/}
      <CommerceGoodsAdd
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet({ show: false })}
      ></CommerceGoodsAdd>
      {/* 详情 */}
      <PlatformEquityGoodsDetail
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
      ></PlatformEquityGoodsDetail>
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
    </>
  );
};

export default connect(({ specialGoods, loading }) => ({
  specialGoods,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(PlatformEquityGoods);
