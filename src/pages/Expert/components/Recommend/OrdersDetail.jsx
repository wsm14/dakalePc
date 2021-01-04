import React, { useState } from 'react';
import { connect } from 'umi';
import { Spin, Popover } from 'antd';
import styles from './style.less';

const MasterOrderDetail = ({ kolMomentsId, detail, loading, dispatch }) => {
  const [visible, setVisible] = useState(false);

  // 获取详情
  const fetchGetDetail = () => {
    if (!visible)
      dispatch({
        type: 'expertRecommend/fetchExpertRemdDetail',
        payload: { kolMomentsId },
      });
  };

  const oderDom = (
    <div className={styles.recommend_content}>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>内容分类：</span>
        <span className={styles.recommend_content_itemContent}>{detail.categoryName}</span>
      </div>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>关联话题：</span>
        <span className={styles.recommend_content_itemContent}>{detail.topicName}</span>
      </div>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>关联商家：</span>
        <span className={styles.recommend_content_itemContent}>
          {detail.merchantName}
          <div className={styles.recommend_content_tip}>{detail.merchantAddress}</div>
        </span>
      </div>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>关联商品：</span>
        {detail.goodsName ? (
          <span className={styles.recommend_content_itemContent}>
            {detail.goodsName}
            {detail.goodsPrice && (
              <div className={styles.recommend_content_tip}>
                ￥{detail.goodsPrice}（原价￥{detail.oriPrice}）
              </div>
            )}
            <div className={styles.recommend_content_tip}>成交量 {detail.volume || 0}</div>
          </span>
        ) : (
          <span className={styles.recommend_content_itemContent}>--</span>
        )}
      </div>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>卡豆打赏：</span>
        <span className={styles.recommend_content_itemContent}>{detail.payedBeanAmount || 0}</span>
      </div>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>点赞数：</span>
        <span className={styles.recommend_content_itemContent}>{detail.likeAmount || 0}</span>
      </div>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>收藏数：</span>
        <span className={styles.recommend_content_itemContent}>{detail.collectionAmount || 0}</span>
      </div>
      <div className={styles.recommend_content_item}>
        <span className={styles.recommend_content_itemTitle}>观看数：</span>
        <span className={styles.recommend_content_itemContent}>{detail.viewAmount || 0}</span>
      </div>
    </div>
  );

  return kolMomentsId ? (
    <Popover
      destroyTooltipOnHide
      placement="right"
      trigger="click"
      title="内容详情"
      overlayStyle={{ height: 284, width: 300 }}
      content={loading ? <Spin></Spin> : oderDom}
      onVisibleChange={(val) => setVisible(val)}
    >
      <a onClick={fetchGetDetail}>详情</a>
    </Popover>
  ) : (
    ''
  );
};

export default connect(({ expertRecommend, loading }) => ({
  detail: expertRecommend.detail,
  loading: loading.effects['expertRecommend/fetchExpertRemdDetail'],
}))(MasterOrderDetail);
