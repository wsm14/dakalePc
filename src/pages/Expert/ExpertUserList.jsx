import React, { useRef } from 'react';
import { connect } from 'umi';
import { EXPERT_USER_STATUS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import closeExpert from './components/UserList/CloseExpert';

const ExpertUserList = (props) => {
  const { expertUserList, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '哒人昵称',
      name: 'username',
    },
    {
      label: '等级',
      name: 'level',
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      select: { list: EXPERT_USER_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '哒人昵称',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '哒人等级',
      align: 'center',
      dataIndex: 'level',
    },
    {
      title: '发布视频',
      align: 'right',
      dataIndex: 'videoCount',
    },
    {
      title: '发布图文',
      align: 'right',
      dataIndex: 'imageCount',
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
      title: '带货成交量',
      align: 'right',
      dataIndex: 'goodsCount',
      render: (val) => val || 0,
    },
    {
      title: '带货收益',
      align: 'right',
      dataIndex: 'cargoIncome',
      render: (val) => val || 0,
    },
    {
      title: '解锁时间',
      align: 'center',
      dataIndex: 'unlockTime',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => EXPERT_USER_STATUS[val],
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'kolUserId',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              visible: record.status == 1,
              auth: 'status',
              title: '封停',
              click: () => fetchCloseExpert({ kolUserId: val, username: record.username }),
            },
            {
              type: 'own',
              pop: true,
              visible: record.status != 1,
              auth: 'status',
              title: '解封',
              click: () => fetchExpertOpen({ kolUserId: val }),
            },
          ]}
        />
      ),
    },
  ];

  // 封停
  const fetchCloseExpert = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: closeExpert({ dispatch, childRef, initialValues }),
    });
  };

  // 解封
  const fetchExpertOpen = (values) => {
    dispatch({
      type: 'expertUserList/fetchExpertOpen',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  // 统计数
  const fetchExpertUserTotal = () => {
    dispatch({
      type: 'expertUserList/fetchExpertUserTotal',
    });
  };

  // useEffect(() => {
  //   fetchExpertUserTotal();
  // }, []);

  return (
    <TableDataBlock
      keepName
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.kolUserId}`}
      dispatchType="expertUserList/fetchGetList"
      {...expertUserList.list}
    >
      {/* <Card
        style={{ marginBottom: 16 }}
        bodyStyle={{ display: 'flex', alignItems: 'center', padding: '10px 24px' }}
      >
        哒人总数： <Statistic value={userTotal}></Statistic>
      </Card> */}
    </TableDataBlock>
  );
};

export default connect(({ expertUserList, loading }) => ({
  expertUserList,
  loading: loading.models.expertUserList,
}))(ExpertUserList);
