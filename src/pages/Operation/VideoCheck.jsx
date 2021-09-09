import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card, Tag } from 'antd';
import { BUSINESS_TYPE, ACTION_TYPE, SHARE_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import NoCheck from './components/VideoChecks/NoCheck';
import NoConfirm from './components/VideoChecks/NoConfirm';
import AlCheck from './components/VideoChecks/AlCheck';
import AlConfirm from './components/VideoChecks/AlConfirm';
import { checkCityName } from '@/utils/utils';

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
  const { dispatch, specialGoodsCheck } = props;
  const [tabkey, setTabKey] = useState('adminAudit');
  const { list } = specialGoodsCheck;

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
  const globalSearch = [
    {
      label: '分享标题',
      name: 'title',
    },
    {
      label: '集团/店铺名',
      name: 'ownerId',
      type: 'merchant',
    },

    {
      label: '创建人',
      name: 'creator',
    },
    {
      label: '审核创建时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '审核对象',
      name: 'creator',
    },
    {
      label: '审核时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
    {
      label: '分享类型',
      type: 'select',
      name: 'contentType',
      select: SHARE_TYPE,
    },
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '店铺类型',
      name: 'userType',
      type: 'select',
      select: BUSINESS_TYPE,
    },

    {
      label: '审核类型',
      name: 'actionType',
      type: 'select',
      select: ACTION_TYPE,
    },
  ];

  //tab自组件Table公用的colum数据部分
  const globalColum = [
    {
      title: '视频/标题',
      fixed: 'left',
      dataIndex: 'frontImage',
      width: 280,
      render: (val, detail) => (
        <PopImgShow url={val}>
          <Ellipsis length={10} tooltip lines={3}>
            {detail.title}
          </Ellipsis>
        </PopImgShow>
      ),
    },
    {
      title: '店铺/集团',
      dataIndex: 'userType',
      width: 320,
      render: (val, row) => (
        <>
          <div style={{ display: 'flex' }}>
            <Tag>{BUSINESS_TYPE[val]}</Tag>
            <Ellipsis length={15} tooltip>
              {row.merchantName}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Tag color="blue">{`${row.topCategoryName}-${row.categoryName}`}</Tag>
            <span>{checkCityName(row.districtCode)}</span>
          </div>
        </>
      ),
    },
    {
      title: '单次打赏卡豆数',
      align: 'right',
      dataIndex: 'beanAmount',
    },
    {
      title: '审核创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '确认时间',
      align: 'center',
      dataIndex: 'createTime',
      show:tabkey==='', // 审核已确认
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '审核时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '审核对象',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '审核类型',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creatorName || ''}`,
    },
    {
      title: '审核结果',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '驳回原因',
      align: 'center',
      dataIndex: 'createTime',
    },
  ];

  const rowHandle = [
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
  const listProps = { tableRef, tabkey, globalColum, globalSearch, rowHandle };

  const contentList = {
    adminAudit: <NoCheck {...listProps}></NoCheck>,
    merchantAudit: <NoConfirm {...listProps}></NoConfirm>,
    adminConfirmed: <AlCheck {...listProps}></AlCheck>,
    merchantConfirmed: <AlConfirm {...listProps}></AlConfirm>,
  };

  // 获取详情
  //   const fetchSpecialGoodsDetail = (index, type) => {
  //     const { ownerIdString, auditIdString, auditStatus: status, submitterType } = list[index];
  //     dispatch({
  //       type: 'specialGoodsCheck/fetchSpecialGoodsAuditDetail',
  //       payload: { ownerId: ownerIdString, auditId: auditIdString, type },
  //       callback: (val) => {
  //         const newProps = {
  //           show: true,
  //           detail: { ...val },
  //         };
  //         if (type == 'info' || type === 'check') {
  //           setVisibleInfo({
  //             status,
  //             index,
  //             ...newProps,
  //             ownerIdString,
  //             auditIdString,
  //             submitterType,
  //           });
  //         } else {
  //           setVisibleSet({ type, ...newProps });
  //         }
  //       },
  //     });
  //   };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
      {/* 详情 */}
      {/* <SpecialGoodCheckDetail
        visible={visibleInfo}
        total={list.length}
        tabkey={tabkey}
        cRef={tableRef}
        getDetail={fetchSpecialGoodsDetail}
        onClose={() => setVisibleInfo(false)}
      ></SpecialGoodCheckDetail> */}
    </>
  );
};
export default connect(({ specialGoodsCheck }) => ({
  specialGoodsCheck,
}))(SpecialGoodCheck);
