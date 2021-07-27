import React, { useRef, useState, useEffect } from 'react';
import { connect, Link } from 'umi';
import { Alert } from 'antd';
import { EXPERT_USER_TYPE, EXPERT_LIST_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import SubCommissionStatistics from './components/Achievement/SubCommissionStatistics';
import RecommendModal from './components/Achievement/RecommendModal';

const ExpertUserAchievement = (props) => {
  const { list, kolLevel, loading, dispatch } = props;

  const [visible, setVisible] = useState(false);
  const [visibleList, setVisibleList] = useState(false);

  const childRef = useRef();

  useEffect(() => {
    fetchGetKolLevel();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '哒人',
      name: 'userNameOrBeanCodeOrMobile',
      placeholder: '请输入昵称、豆号或手机号',
    },
    {
      label: '级别',
      name: 'level',
      type: 'select',
      select: kolLevel,
    },
    {
      label: '身份',
      name: 'levelKey',
      type: 'select',
      select: EXPERT_LIST_TYPE,
    },
    {
      label: '注册地',
      type: 'cascader',
      name: 'city',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: EXPERT_USER_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: 'ID',
      dataIndex: 'kolUserId',
    },
    {
      title: '昵称',
      dataIndex: 'username',
    },
    {
      title: '手机号/豆号',
      dataIndex: 'beanCode',
      render: (val, row) => `${row.mobile}\n${val}`,
    },
    {
      title: '身份',
      dataIndex: 'levelKey',
      render: (val) => EXPERT_LIST_TYPE[val],
    },
    {
      title: '级别',
      align: 'center',
      dataIndex: 'level',
    },
    // {
    //   title: '团队人数',
    //   align: 'center',
    //   dataIndex: 'teamSize',
    //   render: (val, row) => {
    //     return row.kolUserId;
    //   },
    // },
    // {
    //   title: '用户｜哒人｜豆长',
    //   align: 'center',
    //   dataIndex: 'level',
    // },
    // {
    //   title: '分销-核销笔数',
    //   align: 'center',
    //   dataIndex: 'level',
    //   render: (val, row) => {
    //     return <Link to="/expert/distribution"> {row.number || 'null'}</Link>;
    //   },
    // },
    // {
    //   title: '分销-业绩流水',
    //   align: 'center',
    //   dataIndex: 'level',
    //   render: (val, row) => {
    //     return `¥ ${row.kolUserId}`;
    //   },
    // },
    // {
    //   title: '累计分佣',
    //   align: 'center',
    //   dataIndex: 'level',
    //   render: (val, row) => {
    //     return `¥ ${row.kolUserId}`;
    //   },
    // },
    // {
    //   title: '待分佣',
    //   align: 'center',
    //   dataIndex: 'level',
    //   render: (val, row) => {
    //     return `¥ ${row.kolUserId}`;
    //   },
    // },
    {
      type: 'handle',
      dataIndex: 'kolUserId',
      render: (val, detail) => [
        {
          type: 'recommendList',
          click: () => setVisibleList({ show: true, detail }),
        },
        {
          auth: 'statistics',
          title: '分佣统计',
          click: () => setVisible({ show: true, detail }),
        },
      ],
    },
  ];

  // 获取哒人等级数据
  const fetchGetKolLevel = () => {
    dispatch({
      type: 'baseData/fetchGetKolLevel',
    });
  };

  return (
    <>
      <Alert message="当前数据统计到昨日" type="info" banner />
      <TableDataBlock
        order
        keepData
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.kolUserId}`}
        dispatchType="expertUserAchievement/fetchGetList"
        {...list}
      ></TableDataBlock>
      {/* 分佣统计 */}
      <SubCommissionStatistics
        visible={visible}
        onClose={() => setVisible(false)}
      ></SubCommissionStatistics>
      {/* 推荐列表 */}
      <RecommendModal visible={visibleList} onClose={() => setVisibleList(false)}></RecommendModal>
    </>
  );
};

export default connect(({ expertUserAchievement, baseData, loading }) => ({
  list: expertUserAchievement.list,
  kolLevel: baseData.kolLevel,
  loading: loading.effects['expertUserAchievement/fetchGetList'],
}))(ExpertUserAchievement);
