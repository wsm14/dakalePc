import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { ACTIVITY_STATUS } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import CITYJSON from '@/common/cityJson';
import TableDataBlock from '@/components/TableDataBlock';
import ModalDataList from './components/AddNewActivity/HelpModalDataList';
import AddNewActivitySet from './components/AddNewActivity/AddNewActivitySet';

// 拉新活动
const AddNewActivity = (props) => {
  const { addNewList, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 新增+编辑
  const [visibleData, setVisibleData] = useState(false); // 数据表格

  const changeTime = (row) => {
    let { activityBeginTime, activityEndTime } = row;
    if (activityBeginTime && activityEndTime) {
      const nowTime = new Date().getTime();
      activityBeginTime = new Date(activityBeginTime).getTime();
      activityEndTime = new Date(activityEndTime).getTime();
      if (nowTime >= activityBeginTime && nowTime <= activityEndTime) {
        return 1;
      } else if (nowTime < activityBeginTime) {
        return 0;
      } else if (nowTime > activityEndTime) {
        return 2;
      }
    }
    return '';
  };

  // 搜索参数
  const searchItems = [
    {
      label: '活动名称',
      name: 'name',
    },
    {
      label: '活动状态',
      name: 'status',
      type: 'select',
      select: ACTIVITY_STATUS,
    },
    {
      label: '活动城市',
      type: 'select',
      name: 'cityCode',
      fieldNames: { label: 'name', value: 'id' },
      select: CITYJSON.filter((item) => item.level === '2'),
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '活动ID',
      align: 'center',
      fixed: 'left',
      dataIndex: 'configFissionTemplateId',
    },
    {
      title: '活动名称',
      align: 'center',
      fixed: 'left',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '邀请人数',
      align: 'right',
      dataIndex: 'invitedPeopleNum',
    },
    {
      title: '活动时间',
      align: 'right',
      dataIndex: 'activityBeginTime',
      render: (val, row) => (val ? `${val}\n~${row?.activityEndTime}` : '--'),
    },
    {
      title: '活动城市',
      align: 'center',
      dataIndex: 'cityCode',
      ellipsis: true,
      render: (val) => (val === 'all' ? '全国' : checkCityName(val)),
    },
    {
      title: '奖品类型',
      align: 'center',
      dataIndex: 'prizeType',
      render: (val) => ({ bean: '卡豆', commerce: '电商品', platformCoupon: '平台券' }[val]),
    },
    {
      title: '奖品名称/ID',
      align: 'center',
      width: 180,
      dataIndex: 'prizeName',
      render: (val, row) => `${val || ''}\n${row.prizeId || ''}`,
    },
    {
      title: '活动状态',
      align: 'center',
      dataIndex: 'status',
      render: (val, row) => ACTIVITY_STATUS[changeTime(row)],
    },
    {
      title: '剩余库存',
      align: 'center',
      dataIndex: 'recipientsNum',
      render: (val, row) => row.issuedQuantity - val,
    },
    {
      title: '创建时间/创建人',
      align: 'center',
      dataIndex: 'creator',
      render: (val, record) => `${record.createTime}\n${val}`,
    },
    {
      type: 'handle',
      dataIndex: 'configFissionTemplateId',
      render: (val, row, index) => [
        {
          type: 'down', // 下架
          visible: changeTime(row) !== 2,
          click: () => fetchMarketActivityCancel({ configFissionTemplateId: val }),
        },
        {
          type: 'edit', // 编辑
          click: () => fetchAddNewDetail(index),
        },
        {
          type: 'data', // 数据
          visible: changeTime(row) > 0,
          click: () => setVisibleData({ show: true, row }),
        },
      ],
    },
  ];

  // 获取详情
  const fetchAddNewDetail = (index) => {
    const { configFissionTemplateId } = addNewList?.list[index];
    dispatch({
      type: 'addNewActivity/fetchMarketAddNewActivityDetail',
      payload: {
        configFissionTemplateId,
      },
      callback: (detail) => setVisible({ show: true, mode: 'edit', detail }),
    });
  };

  // 活动下架
  const fetchMarketActivityCancel = (payload) => {
    dispatch({
      type: 'addNewActivity/fetchMarketAddNewActivityCancel',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 设置新增活动
  const handleSetActive = () => setVisible({ show: true, mode: 'add' });

  const btnExtra = [
    {
      text: '新增',
      auth: 'save',
      onClick: handleSetActive,
    },
  ];

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        loading={loading}
        btnExtra={btnExtra}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => record.configFissionTemplateId}
        dispatchType="addNewActivity/fetchGetList"
        {...addNewList}
      ></TableDataBlock>
      {/* 新增，编辑 */}
      <AddNewActivitySet
        visible={visible}
        childRef={childRef}
        onClose={() => setVisible(false)}
      ></AddNewActivitySet>
      {/* 数据表格 */}
      <ModalDataList visible={visibleData} onClose={() => setVisibleData(false)}></ModalDataList>
    </>
  );
};

export default connect(({ addNewActivity, loading }) => ({
  addNewList: addNewActivity.list,
  loading:
    loading.effects['addNewActivity/fetchGetList'] ||
    loading.effects['addNewActivity/fetchMarketAddNewActivityDetail'],
}))(AddNewActivity);
