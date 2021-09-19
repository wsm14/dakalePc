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
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import PlatformEquityDrawer from './components/PlatformEquityDrawer';

/**
 * 权益商品
 */
const PlatformEquityGoods = (props) => {
  const { specialGoods, loading, dispatch } = props;
  const { list } = specialGoods;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState(false); // 新增特惠活动
  const [searchType, setSearchType] = useState(null); // 搜索类型

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
      name: 'ownerId',
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
      name: 'ownerType',
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
              <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.ownerName}
              </Ellipsis>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'oriPrice',
      render: (val, row) => {
        const zhe = (Number(row.realPrice) / Number(val)) * 10;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(val).toFixed(2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div>￥{Number(row.realPrice).toFixed(2)}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '成本价',
      align: 'right',
      dataIndex: 'otherPlatformPrice',
      render: (val) => `￥${val}`,
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
      align: 'right',
      dataIndex: 'writeOffGoodsCount',
      sorter: (a, b) => a.writeOffGoodsCount - b.writeOffGoodsCount,
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
        const { status, deleteFlag } = record;
        return [
          {
            type: 'info',
            click: () => setVisibleSet(index, 'info'),
          },
          {
            auth: 'up',
            visible: status == '1' && deleteFlag == '1', // 活动中 && 未删除
            click: () => setVisibleSet({}),
          },
          {
            auth: 'down',
            visible: status == '1' && deleteFlag == '1', // 活动中 && 未删除
            click: () => setVisibleSet({}),
          },
          {
            type: 'edit',
            visible: ['1'].includes(status) && deleteFlag == '1', // 活动中 && 未删除
            click: () => setVisibleSet(index, 'edit'),
          },
          {
            type: 'diary',
            click: () => setVisibleSet({ type: 'specialGoods', identificationId: val }),
          },
        ];
      },
    },
  ];

  const btnList = [
    {
      auth: 'save',
      onClick: () => setVisibleSet({ type: 'add', show: true }),
    },
  ];

  return (
    <>
      <TableDataBlock
        keepData
        btnExtra={btnList}
        noCard={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ deleteFlag: '1' }}
        rowKey={(record) => `${record.specialGoodsId}`}
        dispatchType="specialGoods/fetchGetList"
        {...specialGoods}
      ></TableDataBlock>
      {/* 新增 编辑 */}
      <PlatformEquityDrawer visible={visible} onClose={onClose}></PlatformEquityDrawer>
    </>
  );
};

export default connect(({ specialGoods, loading }) => ({
  specialGoods,
  loading: loading.models.specialGoods || loading.effects['baseData/fetchGetLogDetail'],
}))(PlatformEquityGoods);
