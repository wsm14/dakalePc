import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Statistic, Skeleton } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';

const UserChart = ({ dispatch, searchData, totalData, loading }) => {
  useEffect(() => {
    fetchGetTotalData(searchData);
  }, [searchData]);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockOrder',
      payload,
    });
  };

  const orderArr = [
    {
      title: '新增用户',
      info: '新注册的用户数',
      key: 'allTotal',
    },
    {
      title: '累计注册用户',
      info: '累计注册的用户数',
      key: 'scan',
    },
    {
      title: '新增哒人',
      info: '从普通用户升级成哒人的用户数',
      key: 'verificationFee',
    },
    {
      title: '累计哒人数',
      info: '已经升级成为哒人的用户数',
      key: 'distinctPerson',
    },
    {
      title: '哒人卡豆收益',
      info: '哒人通过带货得到的收益卡豆',
      key: 'kolGoods',
    },
    {
      title: '哒人发布视频数',
      info: '哒人发布的视频数，每发布一次记一次',
      key: 'specialGoods',
    },
    {
      title: '哒人带货次数',
      info: '哒人带货的次数，每带货一次记一次',
      key: 'refundFee',
    },
    {
      title: '哒人推店次数',
      info: '哒人推荐店铺的次数，每推荐一次店铺记一次',
      key: 'refundFee',
    },
  ];

  const gridStyle = {
    width: '25%',
    height: 111,
    textAlign: 'center',
  };

  const checkData = (checkData, key, reData = 0) => {
    return checkData ? checkData[key] : reData;
  };

  return (
    <Card bodyStyle={{ padding: 0 }} bordered={false} style={{ marginTop: 20 }}>
      <Skeleton loading={loading} active>
        {orderArr.map((item) => (
          <Card.Grid style={gridStyle} key={item.title}>
            <Statistic
              title={
                <QuestionTooltip
                  title={item.title}
                  content={item.info}
                  type="quest"
                ></QuestionTooltip>
              }
              value={checkData(totalData[item.key], 'totalFee')}
            />
          </Card.Grid>
        ))}
      </Skeleton>
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  totalData: chartBlock.userInfo,
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(UserChart);
