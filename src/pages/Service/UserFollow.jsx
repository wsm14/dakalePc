import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import { FOLLOW_TYPE, FOLLOW_MANNER, SHARE_SEX_TYPE } from '@/common/constant';
import UserFollowDetail from './components/UserFollow/UserFollowDetail';
import UserFollowSet from './components/UserFollow/UserFollowSet';

const UserFollow = (props) => {
  const { userFollow, dispatch, loading } = props;
  const childRef = useRef();
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tags, setTags] = useState([]);

  //获取标签列表
  useEffect(() => {
    dispatch({
      type: 'userFollow/fetchGetDictionaryAdmin',
      payload: {
        parent: 'userFollowUp',
        child: 'tags',
      },
      callback: (tag) => {
        const { extraParam = '' } = tag;
        const tagArr = extraParam?.split(',');
        setTags(tagArr);
      },
    });
  }, []);

  // 搜索参数
  const searchItems = [
    {
      label: '用户',
      type: 'user',
      name: 'userId',
    },
    {
      label: '跟进人',
      name: 'follower',
    },
    {
      label: '跟进标签',
      name: 'tags',
      type: 'multiple',
      select: tags,
    },
    {
      label: '跟进方式',
      name: 'manner',
      type: 'select',
      select: FOLLOW_MANNER,
    },
    {
      label: '跟进类型',
      name: 'type',
      type: 'select',
      select: FOLLOW_TYPE,
    },
    {
      label: '跟进时间',
      type: 'rangePicker',
      name: 'followBeginTime',
      end: 'followEndTime',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '用户昵称',
      dataIndex: 'userName',
    },
    {
      title: '注册手机号',
      dataIndex: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (val) => SHARE_SEX_TYPE[val],
    },
    {
      title: '跟进方式',
      dataIndex: 'manner',
      render: (val) => FOLLOW_MANNER[val],
    },
    {
      title: '跟进类型',
      dataIndex: 'type',
      render: (val) => FOLLOW_TYPE[val],
    },
    {
      title: '跟进内容',
      dataIndex: 'content',
    },
    {
      title: '跟进标签',
      dataIndex: 'tags',
    },
    {
      title: '跟进结果',
      dataIndex: 'result',
    },
    {
      title: '跟进人',
      dataIndex: 'follower',
    },
    {
      title: '跟进时间',
      dataIndex: 'followTime',
    },
    {
      title: '操作',
      type: 'handle',
      dataIndex: 'userFollowUpId',
      render: (val) => [
        {
          type: 'info',
          click: () => fetchDetail(),
        },
        {
          type: 'edit',
          click: () => fetchDetailInfo(val),
        },
      ],
    },
  ];

  const fetchDetailInfo =(userFollowUpId)=>{
    dispatch({
      type:'userFollow/'
    })
    

  }

  const fetchDetail = () => {
    setVisibleInfo({
      type: 'add',
      show: true,
      detail: {},
    });
  };

  // 表格额外按钮
  const extraBtn = [
    { auth: 'save', onClick: () => setVisible({ show: true, type: 'add', info: {} }) },
  ];

  return (
    <>
      <TableDataBlock
        order
        cRef={childRef}
        btnExtra={extraBtn}
        loading={loading}
        searchItems={searchItems}
        columns={getColumns}
        rowKey={(record) => `${record.userFollowUpId}`}
        dispatchType="userFollow/fetchGetList"
        {...userFollow}
      ></TableDataBlock>
      {/* 详情 */}
      <UserFollowDetail
        visible={visibleInfo}
        onClose={() => setVisibleInfo(false)}
      ></UserFollowDetail>
      {/* 新增 编辑 */}
      <UserFollowSet
        visible={visible}
        onClose={() => setVisible(false)}
        childRef={childRef}
      ></UserFollowSet>
    </>
  );
};
export default connect(({ userFollow, loading }) => {
  console.log(userFollow, 'userFollow');
  return {
    userFollow,
    loading: loading.models.userFollow,
  };
})(UserFollow);
