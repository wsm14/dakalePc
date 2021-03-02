import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { EXPERT_USER_TYPE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import CloseExpert from './components/UserList/CloseExpert';

const ExpertUserList = (props) => {
  const { expertUserList, loading, dispatch } = props;

  const [visible, setVisible] = useState(false);

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
      select: EXPERT_USER_TYPE,
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
      render: (val) => EXPERT_USER_TYPE[val],
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'kolUserId',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              visible: record.status == 1,
              auth: 'status',
              title: '封停',
              click: () => fetchCloseExpert({ kolUserId: val, username: record.username }),
            },
            {
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
    </>
  );
};

export default connect(({ expertUserList, loading }) => ({
  expertUserList,
  loading: loading.models.expertUserList,
}))(ExpertUserList);
