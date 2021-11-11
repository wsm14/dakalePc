import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { EXPERT_USER_STATUS, EXPERT_LIST_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import CloseExpert from './components/UserList/CloseExpert';
import ExpertUserLog from './components/UserList/ExpertUserLog';
import SubCommissionStatistics from './components/UserList/SubCommissionStatistics';
import RecommendModal from './components/UserList/RecommendModal';
import BDSet from './components/UserList/BDSet';
import DarenTagSet from './components/UserList/DarenTagSet';
import { checkCityName } from '@/utils/utils';

const ExpertUserList = (props) => {
  const { expertUserList, kolLevel, loading, dispatch } = props;
  const { darenTag } = expertUserList;

  const [visible, setVisible] = useState(false); // 封停理由
  const [visibleLog, setVisibleLog] = useState(false); // 操作日志
  const [visibleCommission, setVisibleCommission] = useState(false); // 分佣统计
  const [visibleRecommend, setVisibleRecommend] = useState(false); // 推荐列表
  const [visibleBD, setVisibleBD] = useState(false); // 关联bd
  const [visibleSet, setVisibleSet] = useState(false); // 设置哒人标识

  const childRef = useRef();

  useEffect(() => {
    fetchGetKolLevel();
    fetchDarenTag();
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '哒人',
      name: 'userNameOrBeanCodeOrMobile',
      placeholder: '请输入昵称、豆号或手机号',
    },
    {
      label: '哒人标识',
      name: 'userIdentification',
      type: 'select',
      select: darenTag.extraParam?.split(',').map((item) => ({ name: item, value: item })),
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
      fixed: 'left',
      dataIndex: 'username',
      render: (val, row) => `${val}\n${row.kolUserId}`,
    },
    {
      title: '手机号/豆号',
      dataIndex: 'mobile',
      render: (val, row) => `${val}\n${row.beanCode}`,
    },
    {
      title: '哒人标识',
      dataIndex: 'userIdentification',
    },
    {
      title: '级别',
      dataIndex: 'level',
    },
    {
      title: '是否实习',
      dataIndex: 'tempLevelFlag',
      render: (val) => (val === '1' ? '是' : '否'),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val) => ({ M: '男', F: '女', '': '--' }[val]),
    },
    {
      title: '注册地',
      dataIndex: 'districtCode',
      render: (val) => checkCityName(val) || '--',
    },
    {
      title: '家人数',
      align: 'right',
      dataIndex: 'familyCount',
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
    {
      title: '解锁时间',
      align: 'center',
      dataIndex: 'unlockTime',
    },
    {
      title: '关联BD',
      align: 'center',
      fixed: 'right',
      dataIndex: 'sellName',
      render: (val, row) => `${val}\n${row.sellMobile}`,
    },
    {
      title: '状态',
      align: 'center',
      fixed: 'right',
      dataIndex: 'suspendStatus',
      render: (val) => (
        <span style={val !== '1' ? { color: 'red' } : {}}>{EXPERT_USER_STATUS[val]}</span>
      ),
    },
    {
      type: 'handle',
      width: 180,
      dataIndex: 'kolUserId',
      render: (val, detail) => [
        {
          type: 'recommendList',
          click: () => setVisibleRecommend({ show: true, detail }),
        },
        {
          type: 'statistics',
          click: () => setVisibleCommission({ show: true, detail }),
        },
        {
          visible: detail.suspendStatus == 1,
          auth: 'status',
          title: '封停',
          click: () => fetchCloseExpert({ kolUserId: val, username: detail.username }),
        },
        {
          pop: true,
          visible: detail.suspendStatus != 1,
          auth: 'status',
          title: '解封',
          click: () => fetchExpertOpen({ kolUserId: val }),
        },
        {
          type: 'BDSet', // 关联BD
          click: () => setVisibleBD({ show: true, detail }),
        },
        {
          type: 'diary', // 日志
          click: () => fetchGetKolLog(val, detail),
        },
        {
          type: 'set', // 设置哒人标识
          click: () => setVisibleSet({ show: true, detail, darenTag }),
        },
      ],
    },
  ];

  // 获取哒人标识
  const fetchDarenTag = () => {
    dispatch({
      type: 'expertUserList/fetchDarenTag',
      payload: {
        parent: 'user',
        child: 'userIdentification',
      },
    });
  };

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
      {/* 分佣统计 */}
      <SubCommissionStatistics
        visible={visibleCommission}
        onClose={() => setVisibleCommission(false)}
      ></SubCommissionStatistics>
      {/* 推荐列表 */}
      <RecommendModal
        visible={visibleRecommend}
        onClose={() => setVisibleRecommend(false)}
      ></RecommendModal>
      {/* 关联BD */}
      <BDSet visible={visibleBD} onClose={() => setVisibleBD(false)}></BDSet>
      {/* 设置哒人标识 */}
      <DarenTagSet
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></DarenTagSet>
    </>
  );
};

export default connect(({ baseData, expertUserList, loading }) => ({
  expertUserList,
  kolLevel: baseData.kolLevel,
  loading: loading.models.expertUserList || loading.models.baseData,
}))(ExpertUserList);
