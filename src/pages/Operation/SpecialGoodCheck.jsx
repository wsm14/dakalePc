import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import {
  BUSINESS_TYPE,
  ACTION_TYPE,
  GOODS_CLASS_TYPE,
  SUBMIT_TYPE,
  GOODS_CHECK_RESSTATUS,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import TableDataBlock from '@/components/TableDataBlock';
import SpecialGoodCheckDetail from './components/SpecialGoodCheck/SpecialGoodCheckDetail';

const tabList = [
  {
    key: 'adminAudit',
    tab: '待审核',
  },
  {
    key: 'merchantAudit',
    tab: '待确认',
  },
  {
    key: 'adminConfirmed',
    tab: '已审核',
  },
  {
    key: 'merchantConfirmed',
    tab: '已确认',
  },
];

const SpecialGoodCheck = (props) => {
  const tableRef = useRef();
  const { dispatch, loading, hubData, specialGoodsCheck } = props;

  const [tabkey, setTabKey] = useState('adminAudit');
  const [visibleInfo, setVisibleInfo] = useState(false); // 详情展示
  const { list } = specialGoodsCheck;

  // 获取商圈
  const fetchGetHubSelect = (districtCode) => {
    dispatch({
      type: 'baseData/fetchGetHubData',
      payload: {
        districtCode,
      },
    });
  };

  const fetchSpecialGoodsClose = (record) => {
    const { auditIdString, ownerIdString } = record;
    dispatch({
      type: 'specialGoodsCheck/fetchSpecialGoodsAuditClose',
      payload: {
        ownerId: ownerIdString,
        auditId: auditIdString,
      },
      callback: () => {
        tableRef.current.fetchGetData();
      },
    });
  };

  //组建公用的搜索条件
  const searchItems = [
    {
      label: '商品名称',
      name: 'marketingName',
    },
    {
      label: '集团/店铺名',
      name: 'ownerId',
      type: 'merchant',
    },
    {
      label: '提交人',
      name: 'submitterUserName',
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      onChange: (val) => val.length === 3 && fetchGetHubSelect(val[2]),
    },
    {
      label: '商圈',
      name: 'businessHubId',
      type: 'select',
      // loading: loading,
      allItem: false,
      select: hubData,
      fieldNames: { label: 'businessHubName', value: 'businessHubIdString' },
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'createBeginDate',
      end: 'createEndDate',
    },
    {
      label: '店铺类型',
      name: 'ownerType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '审核类型',
      name: 'actionType',
      type: 'select',
      select: ACTION_TYPE,
    },
    {
      label: '审核结果',
      name: 'auditStatus',
      type: 'select',
      show: ['adminConfirmed', 'merchantConfirmed'].includes(tabkey),
      select: GOODS_CHECK_RESSTATUS,
    },
  ];

  //tab自组件Table公用的colum数据部分
  const getColumns = [
    {
      title: '商品/店铺名称',
      fixed: 'left',
      dataIndex: 'activityGoodsDTO',
      render: (val, row) => {
        const { activityGoodsDTO = {} } = row;
        const { goodsName, goodsType, ownerType, ownerName } = activityGoodsDTO;
        return (
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
              <Tag color={goodsType === 'single' ? 'orange' : 'magenta'}>
                {GOODS_CLASS_TYPE[goodsType]}
              </Tag>
              <Ellipsis length={10} tooltip>
                {goodsName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Tag>{BUSINESS_TYPE[ownerType]}</Tag>
              <Ellipsis length={10} tooltip>
                {ownerName}
              </Ellipsis>
            </div>
          </div>
        );
      },
    },
    {
      title: '佣金',
      align: 'right',
      dataIndex: 'activityGoodsDTO',
      render: (val, row) => {
        const { activityGoodsDTO = {} } = row;
        const commission = activityGoodsDTO.commission ? activityGoodsDTO.commission : 0;
        return `￥${Number(commission).toFixed(2)}`;
      },
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'activityGoodsDTO',
      render: (val, row) => {
        const { activityGoodsDTO = {} } = row;
        const realPrice = activityGoodsDTO.realPrice ? activityGoodsDTO.realPrice : 0;
        const oriPrice = activityGoodsDTO.oriPrice ? activityGoodsDTO.oriPrice : 0;
        const zhe = (Number(realPrice) / Number(oriPrice)) * 10;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(oriPrice).toFixed(2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tag color={'red'}>{`${zhe}`.substring(0, 4)}折</Tag>
              <div>￥{Number(realPrice).toFixed(2)}</div>
            </div>
          </div>
        );
      },
    },

    {
      title: '使用有效期',
      dataIndex: 'activityGoodsDTO',
      render: (val, row) => {
        const { activityGoodsDTO = {} } = row;
        const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = activityGoodsDTO;
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
      title: '审核创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{val}</div>
          <div>
            {SUBMIT_TYPE[record.submitterType]}--{record.submitterUserName}
          </div>
        </div>
      ),
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityGoodsDTO',
      render: (val, row) => {
        const { activityGoodsDTO = {} } = row;
        const {
          activityTimeRule,
          activityEndTime,
          activityStartTime,
          createTime = '',
        } = activityGoodsDTO;
        return (
          <>
            {activityTimeRule === 'infinite'
              ? `${createTime} ~ 长期` //
              : `${activityStartTime} ~ ${activityEndTime}`}
          </>
        );
      },
    },
    {
      title: '投放数量',
      align: 'center',
      dataIndex: 'activityStartTime',
      render: (val, row) => {
        const { activityGoodsDTO = {} } = row;
        const { total = 0 } = activityGoodsDTO;
        return total;
      },
    },
    {
      title: '审核类型',
      align: 'center',
      dataIndex: 'actionType',
      show: tabkey === 'adminConfirmed',
      render: (val) => ACTION_TYPE[val],
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      show: ['adminConfirmed', 'merchantConfirmed'].includes(tabkey),
    },
    {
      title: '审核结果',
      dataIndex: 'auditStatus',
      show: ['adminConfirmed', 'merchantConfirmed'].includes(tabkey),
      render: (val) => GOODS_CHECK_RESSTATUS[val],
    },
    {
      title: '驳回原因',
      dataIndex: 'rejectReason',
      show: ['adminConfirmed', 'merchantConfirmed'].includes(tabkey),
    },
    {
      type: 'handle',
      dataIndex: 'auditIdString',
      render: (val, record, index) => {
        const { auditStatus } = record;
        return [
          {
            type: 'info',
            title: '详情',
            click: () => fetchSpecialGoodsDetail(index, 'info'),
            visible: tabkey !== 'adminAudit',
          },
          {
            type: 'check',
            title: '审核',
            click: () => fetchSpecialGoodsDetail(index, 'check'),
            visible: tabkey === 'adminAudit',
          },
          {
            type: 'close',
            title: '关闭', //驳回状态可以关闭
            visible: auditStatus === '2',
            click: () => fetchSpecialGoodsClose(record),
          },
        ];
      },
    },
  ];

  // 获取详情
  const fetchSpecialGoodsDetail = (index, type) => {
    const { ownerIdString, auditIdString, auditStatus: status, submitterType } = list[index];
    dispatch({
      type: 'specialGoodsCheck/fetchSpecialGoodsAuditDetail',
      payload: { ownerId: ownerIdString, auditId: auditIdString, type },
      callback: (val) => {
        const newProps = {
          show: true,
          detail: { ...val },
        };
        if (type == 'info' || type === 'check') {
          setVisibleInfo({
            status,
            index,
            ...newProps,
            ownerIdString,
            auditIdString,
            submitterType,
          });
        } else {
          setVisibleSet({ type, ...newProps });
        }
      },
    });
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        <TableDataBlock
          noCard={false}
          cRef={tableRef}
          loading={loading}
          columns={getColumns}
          searchItems={searchItems}
          rowKey={(record) => `${record.auditIdString}`}
          dispatchType="specialGoodsCheck/fetchGetList"
          params={{ auditSearchType: tabkey }}
          {...specialGoodsCheck}
        ></TableDataBlock>
      </Card>
      {/* 详情 */}
      <SpecialGoodCheckDetail
        visible={visibleInfo}
        total={list.length}
        tabkey={tabkey}
        cRef={tableRef}
        getDetail={fetchSpecialGoodsDetail}
        onClose={() => setVisibleInfo(false)}
      ></SpecialGoodCheckDetail>
    </>
  );
};
export default connect(({ baseData, loading, specialGoodsCheck }) => ({
  specialGoodsCheck,
  hubData: baseData.hubData,
  loading: loading.models.baseData || loading.models.specialGoodsCheck,
}))(SpecialGoodCheck);
