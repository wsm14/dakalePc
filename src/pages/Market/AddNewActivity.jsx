import React, { useRef, useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { ACTIVITY_STATUS } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import CITYJSON from '@/common/cityJson';
import TableDataBlock from '@/components/TableDataBlock';
import AddNewActivitySet from './components/AddNewActivity/AddNewActivitySet';

// 拉新活动
const AddNewActivity = (props) => {
  const { addNewList, loading, dispatch } = props;

  // console.log('addNewList', addNewList);

  const childRef = useRef();
  const [visible, setVisible] = useState(false); // 新增+编辑
  // const [state, setstate] = useState(0);

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
      title: '活动id',
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
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityBeginTime',
      render: (val, row) => (val ? `${val}~${row?.activityEndTime}` : '--'),
    },
    {
      title: '活动城市',
      align: 'center',
      dataIndex: 'cityCode',
      ellipsis: true,
      render: (val) => checkCityName(val),
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
      // dataIndex: 'aaaaa',
      render: (val, record) => `${record.createTime}\n${record.creator}`,
    },
    {
      type: 'handle',
      dataIndex: 'configFissionTemplateId',
      render: (val, record, index) => [
        {
          // 下架
          type: 'down',
          visible: changeTime(record) !== 2,
          click: () => fetchMarketActivityCancel({ configFissionTemplateId: val }),
        },
        {
          // 编辑
          type: 'edit',
          click: () => fetchAddNewDetail(index),
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
      callback: (detail) =>
        setVisible({
          show: true,
          type: 'edit',
          detail: {
            ...detail,
            activityBeginTime: [moment(detail.activityBeginTime), moment(detail.activityEndTime)],
          },
        }),
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
  const handleSetActive = () => setVisible({ show: true, type: 'add' });

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
        pagination={false}
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
    </>
  );
};

export default connect(({ addNewActivity, loading }) => ({
  addNewList: addNewActivity,
  loading:
    loading.effects['addNewActivity/fetchGetList'] ||
    loading.effects['addNewActivity/fetchMarketAddNewActivityDetail'],
}))(AddNewActivity);
