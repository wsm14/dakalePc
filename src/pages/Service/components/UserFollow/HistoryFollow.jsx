import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import { FOLLOW_TYPE, FOLLOW_MANNER, SHARE_SEX_TYPE } from '@/common/constant';
import { Pagination, Tag, Empty } from 'antd';

const HistoryFollow = (props) => {
  const { visible, onClose, userId, dispatch, loading } = props;
  const [page, setPage] = useState('1');
  const [total, setTotal] = useState('0');
  const [list, setList] = useState([]);
  useEffect(() => {
    if (visible) {
      fetchList(page);
    }
  }, [visible, page]);

  const fetchList = (page) => {
    dispatch({
      type: 'userFollow/fetchGetList',
      payload: {
        userId,
        page,
        limit: 10,
      },
      callback: (details) => {
        setTotal(details.total);
        setList(details.list);
      },
    });
  };

  const followItem = [
    {
      label: '跟进方式',
      name: 'manner',
      render: (val) => FOLLOW_MANNER[val],
    },
    {
      label: '跟进类型',
      name: 'type',
      render: (val) => FOLLOW_TYPE[val],
    },
    {
      label: '跟进内容',
      name: 'content',
      span: 2,
    },
    {
      label: '跟进标签',
      name: 'tags',
      span: 2,
      render: (val) => {
        return val.split(',').map((tags) => {
          return (
            <Tag key={tags} color="blue">
              {tags}
            </Tag>
          );
        });
      },
    },
    {
      label: '跟进结果',
      name: 'result',
      span: 2,
    },
  ];

  const modalProps = {
    title: '历史跟进情况',
    visible,
    onClose,
    loading,
  };

  const handlePageChange = (val) => {
    setPage(val);
  };
  return (
    <DrawerCondition {...modalProps}>
      {list && list.length ? (
        list.map((item) => (
          <div key={item.userFollowUpId}>
            <div style={{ color: '#999', marginBottom: 15 }}>
              {item.follower} <span style={{ marginLeft: 10 }}>{item.followTime}</span>
            </div>
            <DescriptionsCondition
              labelStyle={{ width: 120 }}
              formItems={followItem}
              initialValues={item}
              column={2}
            ></DescriptionsCondition>
          </div>
        ))
      ) : (
        <Empty />
      )}

      {/* 分页数据 */}
      <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          showSizeChanger
          onChange={handlePageChange}
          defaultCurrent={page}
          total={total}
        />
      </div>
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({ loading: loading.models.userFollow }))(HistoryFollow);
