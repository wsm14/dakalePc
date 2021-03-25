import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { EXPERT_USER_TYPE, EXPERT_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import CloseExpert from './components/UserList/CloseExpert';

const ExpertUserAchievement = (props) => {
  const { expertUserAchievement, kolLevel, loading, dispatch } = props;

  const [visible, setVisible] = useState(false);

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
      select: EXPERT_TYPE,
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
      dataIndex: 'mobile',
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
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'recommendList',
              click: () => fetchCloseExpert({ kolUserId: val, username: record.username }),
            },
            {
              auth: 'statistics',
              title: '分佣统计',
              click: () => fetchExpertOpen({ kolUserId: val }),
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

  // 封停
  const fetchCloseExpert = (initialValues) => setVisible({ show: true, initialValues });

  // 解封
  const fetchExpertOpen = (values) => {
    dispatch({
      type: 'expertUserList/fetchExpertOpen',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <TableDataBlock
        order
        keepData
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.kolUserId}`}
        dispatchType="expertUserAchievement/fetchGetList"
        {...expertUserAchievement.list}
      ></TableDataBlock>
      <CloseExpert
        visible={visible}
        childRef={childRef}
        onClose={() => setVisible(false)}
      ></CloseExpert>
    </>
  );
};

export default connect(({ expertUserAchievement, baseData, loading }) => ({
  expertUserAchievement,
  kolLevel: baseData.kolLevel,
  loading: loading.models.expertUserAchievement,
}))(ExpertUserAchievement);
