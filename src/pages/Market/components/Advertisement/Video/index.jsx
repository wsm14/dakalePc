import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { checkCityName } from '@/utils/utils';
import {
  SHARE_AREA_TYPE,
  VIDEO_ADVERT_TYPE,
  VIDEO_ADVERT_PLACE,
  VIDEO_ADVERT_STATUS,
  SUBMIT_TYPE_VIDEO,
} from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import TableDataBlock from '@/components/TableDataBlock';
import WeightSet from './components/WeightSet';

const ShareManage = (props) => {
  const { videoAdvert, loading, dispatch } = props;
  const { list } = videoAdvert;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 详情
  const [visibleShare, setVisibleShare] = useState(false); // 发布分享

  // 搜索参数
  const searchItems = [
    {
      label: '状态',
      type: 'select',
      name: 'status',
      select: VIDEO_ADVERT_STATUS,
    },
    {
      label: '视频ID',
      name: 'platformMomentId',
    },
    {
      label: '推荐位置',
      name: 'browseType',
      type: 'select',
      select: VIDEO_ADVERT_PLACE,
    },
    {
      label: '分享标题',
      name: 'title',
    },
    {
      label: '店铺/品牌名',
      name: 'relateName',
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
          <span style={{ color: '#999999' }}>{row.platformMomentId}</span>
        </PopImgShow>
      ),
    },
    {
      title: '店铺/品牌',
      dataIndex: 'relateType',
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <Tag>{VIDEO_ADVERT_TYPE[val]}</Tag>
          <Ellipsis length={10} tooltip>
            {row.relateName}
          </Ellipsis>
        </div>
      ),
    },
    {
      title: '投放区域',
      align: 'right',
      dataIndex: 'areaType',
      render: (val) => SHARE_AREA_TYPE[val],
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
      dataIndex: 'browseType',
      render: (val) => VIDEO_ADVERT_PLACE[val],
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
      render: (val) => VIDEO_ADVERT_STATUS[val],
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
      type: 'videoAdvert/fetchStatusClose',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取详情
  const fetchShareDetail = (index, type) => {
    const { userMomentIdString } = list[index];
    dispatch({
      type: 'videoAdvert/fetchShareDetail',
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
        noCard={false}
        btnExtra={extraBtn}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.platformMomentId}`}
        dispatchType="videoAdvert/fetchGetList"
        {...videoAdvert}
      ></TableDataBlock>
    </>
  );
};

export default connect(({ videoAdvert, loading }) => ({
  videoAdvert,
  loading: loading.effects['videoAdvert/fetchGetList'],
}))(ShareManage);
