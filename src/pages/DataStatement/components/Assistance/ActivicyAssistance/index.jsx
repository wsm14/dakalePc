import React, { useState } from 'react';
import { connect } from 'umi';
import { checkCityName } from '@/utils/utils';
import TableDataBlock from '@/components/TableDataBlock';
import BlindboxAssistanceModal from './ActivicyAssistanceModal';

function ActivicyAssistance(props) {
  const { list, loading } = props;

  const [info, setInfo] = useState(null);
  const [visible, setVisible] = useState(false);

  // 搜索参数
  const searchItems = [
    {
      label: '发起用户',
      type: 'user',
      name: 'userId',
    },
    {
      label: '活动名称',
      name: 'userIds',
    },
    {
      label: '奖品类型',
      name: 'usersIds',
      type: 'select',
      select: [],
    },
    {
      label: '发起日期',
      type: 'rangePicker',
      name: 'helpStartTime',
      end: 'helpEndTime',
    },
    {
      label: '用户所属地区',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
      placeholder: '请选择',
    },
    {
      label: '奖品名称',
      name: 'usesdrIds',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '活动名称',
      dataIndex: 'helpDate',
      ellipsis: true,
    },
    {
      title: '邀请人数',
      align: 'right',
      dataIndex: 'userName',
    },
    {
      title: '奖品类型/标签',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '奖品名称/ID',
      dataIndex: 'beanCode',
    },
    {
      title: '发起日期',
      dataIndex: 'helpTsdimes',
    },
    {
      title: '发起用户信息',
      dataIndex: 'helpTsdsddimes',
    },
    {
      title: '用户所属地区',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '当前进度',
      dataIndex: 'helpTimes',
    },
    {
      title: '完成时间',
      dataIndex: 'helsdpTsdimes',
    },
    {
      type: 'handle',
      dataIndex: 'userId',
      render: (val, row) => [
        {
          type: 'assistanceInfo',
          click: () => handleAssistanceInfoModal({ userId: val, helpDate: row.helpDate }),
        },
      ],
    },
  ];

  // 获取详情
  const handleAssistanceInfoModal = (data) => {
    setInfo(data);
    setVisible(true);
  };

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.userId}${record.helpDate}`}
        dispatchType="activicyAssistance/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 助力详情 */}
      <BlindboxAssistanceModal
        params={info}
        visible={visible}
        onCancel={() => setVisible(false)}
      ></BlindboxAssistanceModal>
    </>
  );
}

export default connect(({ activicyAssistance, loading }) => ({
  list: activicyAssistance.list,
  loading: loading.models.activicyAssistance,
}))(ActivicyAssistance);
