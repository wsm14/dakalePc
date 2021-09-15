import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { checkCityName } from '@/utils/utils';
import { NEW_SHARE_STATUS, SUBMIT_TYPE_VIDEO, BUSINESS_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import WeightSet from './components/WeightSet';

const ShareManage = (props) => {
  const { shareManage, loading, dispatch } = props;
  const { list } = shareManage;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 详情
  const [visibleShare, setVisibleShare] = useState(false); // 发布分享

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      type: 'select',
      name: 'status',
      select: NEW_SHARE_STATUS,
    },
    {
      label: '视频ID',
      name: 'contentType',
    },
    {
      label: '推荐位置',
      name: 'browseType',
      type: 'select',
      select: BUSINESS_TYPE,
    },
    {
      label: '分享标题',
      name: 'title',
    },
    {
      label: '店铺/品牌名',
      name: 'ownerId',
      type: 'merchant',
    },
    {
      label: '投放区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '卡豆余额',
      type: 'number',
      name: 'remainBean',
      formatter: (value) => `< ${value}`,
      parser: (value) => value.replace(/\<\s?/g, ''),
    },
    {
      label: '创建时间',
      type: 'rangePicker',
      name: 'beginDate',
      end: 'endDate',
    },
  ];

  // table 表头
  const getColumns = [
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
          {detail.platformMomentId}
        </PopImgShow>
      ),
    },
    {
      title: '店铺/品牌',
      dataIndex: 'userType',
      width: 320,
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <Tag>{BUSINESS_TYPE[val]}</Tag>
          <Ellipsis length={15} tooltip>
            {row.merchantName}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '投放区域',
      align: 'right',
      dataIndex: 'beanAmount',
      render: (val = 0, row) => Math.round(val + (row.exposureBeanAmount || 0)),
      sorter: (a, b) =>
        Math.round(a.beanAmount + (a.exposureBeanAmount || 0)) -
        Math.round(b.beanAmount + (b.exposureBeanAmount || 0)),
    },
    {
      title: '观看人数',
      align: 'right',
      dataIndex: 'viewAmount',
      sorter: (a, b) => a.viewAmount - b.viewAmount,
    },
    {
      title: '领卡豆人数',
      align: 'right',
      dataIndex: 'personAmount',
      sorter: (a, b) => a.personAmount - b.personAmount,
    },

    {
      title: '累计打赏卡豆数',
      align: 'right',
      dataIndex: 'beanAmount',
      sorter: (a, b) => a.beanAmount - b.beanAmount,
    },
    {
      title: '推荐位置',
      align: 'right',
      dataIndex: 'beanPersonAmount',
      render: (val = 0, row) => 111,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) =>
        `${val}\n${SUBMIT_TYPE_VIDEO[row.creatorType]} ${row.creatorName || ''}`,
    },
    {
      title: '权重',
      align: 'center',
      fixed: 'right',
      dataIndex: 'weight',
      render: (val, row) => <WeightSet detail={row}></WeightSet>,
    },
    {
      title: '状态',
      fixed: 'right',
      align: 'right',
      dataIndex: 'status',
      render: (val) => NEW_SHARE_STATUS[val],
    },
    {
      type: 'handle',
      dataIndex: 'length',
      width: 180,
      render: (val, record, index) => {
        const { status } = record;
        return [
          {
            type: 'info', // 详情
            click: () => fetchShareDetail(index, record.contentType || 'video'),
          },
          {
            type: 'edit', // 编辑
            click: () => fetchShareDetail(index, record.contentType || 'video'),
          },
          {
            type: 'down', // 下架
            visible: status == 1 || status == 0,
            click: () => fetchStatusClose({}),
          },
        ];
      },
    },
  ];

  // 下架
  const fetchStatusClose = (values) => {
    dispatch({
      type: 'shareManage/fetchStatusClose',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取详情
  const fetchShareDetail = (index, type) => {
    const { userMomentIdString } = list[index];
    dispatch({
      type: 'shareManage/fetchShareDetail',
      payload: {
        userMomentIdString,
      },
      callback: (detail) => setVisible({ show: true, index, type, detail }),
    });
  };

  const extraBtn = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisibleShare({ type: 'add', show: true }),
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
        rowKey={(record) => `${record.platformMomentId}`}
        dispatchType="shareManage/fetchGetList"
        {...shareManage}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ shareManage, loading }) => ({
  shareManage,
  loading:
    loading.effects['shareManage/fetchGetList'] ||
    loading.effects['shareManage/fetchShareDetail'] ||
    loading.effects['baseData/fetchHandleDetail'],
}))(ShareManage);
