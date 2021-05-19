import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Alert } from 'antd';
import { EXPERT_USER_TYPE, EXPERT_LIST_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
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
      label: '状态',
      name: 'status',
      type: 'select',
      select: EXPERT_USER_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '昵称',
      dataIndex: 'username',
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
    {
      title: '手机号',
      align: 'right',
      dataIndex: 'mobile',
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'kolUserId',
      render: (val, detail) => (
        <HandleSetTable
          formItems={[
            {
              type: 'recommendList',
              click: () => setVisibleList({ show: true, detail }),
            },
            {
              auth: 'statistics',
              title: '分佣统计',
              click: () => setVisible({ show: true, detail }),
            },
          ]}
        />
      ),
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
