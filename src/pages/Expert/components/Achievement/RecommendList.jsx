import React from 'react';
import { connect } from 'umi';
import { EXPERT_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';

const RecommendList = (props) => {
  const {
    recommendList,
    kolLevel,
    loading,
    type,
    detail = {},
    expandedRowKeys,
    expandedRowRender,
    setExpandedRowKeys,
  } = props;

  const { levelKey, kolUserId } = detail;

  const searchItems = [
    {
      label: '成员',
      name: 'member',
      placeholder: '请输入成员昵称或豆号',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '级别',
      name: 'level',
      type: 'select',
      select: kolLevel,
    },
    {
      label: '身份',
      name: 'memberLevelKey',
      type: 'select',
      select: EXPERT_TYPE,
    },
  ];

  const getColumns = [
    {
      title: '级别',
      fixed: 'left',
      dataIndex: 'levelName',
    },
    {
      title: '家人昵称',
      fixed: 'left',
      dataIndex: 'username',
    },
    // {
    //   title: '身份',
    //   align: 'center',
    //   dataIndex: 'levelKey',
    //   render: (val) => EXPERT_TYPE[val],
    // },
    {
      title: '豆号',
      align: 'center',
      dataIndex: 'beanCode',
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'mobile',
    },
    {
      title: '注册时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    {
      title: '最近登录时间',
      align: 'center',
      dataIndex: 'lastLoginTime',
    },
    {
      title: '团队人数',
      align: 'right',
      fixed: 'right',
      dataIndex: 'teamNum',
      render: (val) => val || '--',
    },
  ];

  const tableProps = {
    noCard: false,
    loading,
    columns: getColumns,
    searchItems: !type && searchItems,
    dispatchType: 'expertUserAchievement/fetchExpertUserAchievementRecommend',
    tableSize: 'middle',
    params: { kolUserId, levelKey },
    ...recommendList[kolUserId],
  };

  return (
    <TableDataBlock
      order
      {...tableProps}
      rowKey={(row) => `${row.kolUserId}`}
      expandable={{
        expandedRowKeys,
        expandRowByClick: true,
        rowExpandable: (row) => !!row.teamNum && !type,
        expandedRowRender,
        onExpandedRowsChange: setExpandedRowKeys,
      }}
    />
  );
};

export default connect(({ expertUserAchievement, baseData, loading }) => ({
  recommendList: expertUserAchievement.recommendList,
  kolLevel: baseData.kolLevel,
  loading: loading.effects['expertUserAchievement/fetchExpertUserAchievementRecommend'],
}))(RecommendList);
