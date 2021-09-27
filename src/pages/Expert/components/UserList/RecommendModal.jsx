import React, { useState } from 'react';
import { connect } from 'umi';
import { Modal, Button } from 'antd';
import RecommendList from './RecommendList';

const RecommendModal = (props) => {
  const { visible = {}, onClose, recommendList, dispatch } = props;

  const { show = false, detail = {} } = visible;

  const { username, level, mobile, kolUserId } = detail;

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const expandedRowRender = (row) => <RecommendList detail={row} type="child"></RecommendList>;

  return (
    <Modal
      title={`推荐列表 - ${username} | ${mobile} | ${level}`}
      width={1300}
      destroyOnClose
      afterClose={() => {
        setExpandedRowKeys([]);
        dispatch({ type: 'expertUserAchievement/closeRecommend' });
      }}
      footer={
        <Button
          type="primary"
          onClick={() =>
            setExpandedRowKeys(recommendList[kolUserId].list.map((item) => item.kolUserId))
          }
        >
          展开所有
        </Button>
      }
      visible={show}
      onCancel={onClose}
    >
      <RecommendList
        detail={detail}
        expandedRowKeys={expandedRowKeys}
        setExpandedRowKeys={setExpandedRowKeys}
        expandedRowRender={expandedRowRender}
      ></RecommendList>
    </Modal>
  );
};

export default connect(({ expertUserAchievement, baseData }) => ({
  recommendList: expertUserAchievement.recommendList,
  kolLevel: baseData.kolLevel,
}))(RecommendModal);
