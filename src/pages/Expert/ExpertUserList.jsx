import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { EXPERT_USER_STATUS, EXPERT_LIST_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';
import CloseExpert from './components/UserList/CloseExpert';
import ExpertUserLog from './components/UserList/ExpertUserLog';

const ExpertUserList = (props) => {
  const { expertUserList, kolLevel, loading, dispatch } = props;

  const [visible, setVisible] = useState(false); // 封停理由
  const [visibleLog, setVisibleLog] = useState(false); // 操作日志

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
      type: 'select',
      name: 'suspendStatus',
      select: EXPERT_USER_STATUS,
    },
    {
      label: '解锁时间',
      type: 'rangePicker',
      name: 'unlockTimeStart',
      end: 'unlockTimeEnd',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '昵称',
      dataIndex: 'username',
    },

    {
      title: '级别',
      align: 'center',
      dataIndex: 'level',
    },
    {
      title: '豆号',
      dataIndex: 'beanCode',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '发布视频',
      align: 'right',
      dataIndex: 'videoCount',
    },
    {
      title: '粉丝数',
      align: 'right',
      dataIndex: 'followCount',
    },
    {
      title: '关注数',
      align: 'right',
      dataIndex: 'attentionCount',
    },
    {
      title: '获赞与被收藏',
      align: 'right',
      dataIndex: 'likeAmount',
      render: (val, record) => `${val || 0} || ${record.collectionAmount || 0}`,
    },
    // {
    //   title: '带货成交量',
    //   align: 'right',
    //   dataIndex: 'goodsCount',
    //   render: (val) => val || 0,
    // },
    // {
    //   title: '带货收益',
    //   align: 'right',
    //   dataIndex: 'cargoIncome',
    //   render: (val) => val || 0,
    // },
    {
      title: '解锁时间',
      align: 'center',
      dataIndex: 'unlockTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'suspendStatus',
      render: (val) => (
        <span style={val !== '1' ? { color: 'red' } : {}}>{EXPERT_USER_STATUS[val]}</span>
      ),
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'kolUserId',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              visible: record.suspendStatus == 1,
              auth: 'status',
              title: '封停',
              click: () => fetchCloseExpert({ kolUserId: val, username: record.username }),
            },
            {
              pop: true,
              visible: record.suspendStatus != 1,
              auth: 'status',
              title: '解封',
              click: () => fetchExpertOpen({ kolUserId: val }),
            },
            {
              type: 'diary', // 日志
              click: () => fetchGetKolLog(val, record),
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

  // 获取哒人日志
  const fetchGetKolLog = (id, row) => {
    dispatch({
      type: 'baseData/fetchHandleDetail',
      payload: {
        type: 'suspend_kol,unblock_kol,upgrade_user',
        identifyIdStr: id,
      },
      callback: (val) => setVisibleLog({ show: true, detail: { row, data: val } }),
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
        dispatchType="expertUserList/fetchGetList"
        {...expertUserList.list}
      ></TableDataBlock>
      <CloseExpert
        visible={visible}
        childRef={childRef}
        onClose={() => setVisible(false)}
      ></CloseExpert>
      <ExpertUserLog visible={visibleLog} onClose={() => setVisibleLog(false)}></ExpertUserLog>
    </>
  );
};

export default connect(({ baseData, expertUserList, loading }) => ({
  expertUserList,
  kolLevel: baseData.kolLevel,
  loading: loading.models.expertUserList || loading.models.baseData,
}))(ExpertUserList);
