import React, { useEffect } from 'react';
import { Card } from 'antd';
import { connect } from 'umi';
import QuestionTooltip from '@/components/QuestionTooltip';
import appImg from './components/img/app.jpg';

const AccumulativeData = ({ dispatch, addUpData }) => {
  useEffect(() => {
    dispatch({
      type: 'userDataStat/fetchUserAccumulativeReport',
    });
  }, []);

  const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  const imgStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    flexShrink: 0,
    backgroundSize: '100%',
  };

  const dataList = [
    {
      title: <div style={{ margin: '15px 0' }}>截止昨日24点</div>,
      showArr: [
        {
          url: appImg,
          title: '累计注册用户',
          tip: '指在全站累计注册的用户数',
          data: addUpData.accumulativeRegisterUser,
        },
        {
          url: appImg,
          title: '累计支付用户',
          tip: '指在全站累计支付过的用户数，不论购买任何商品，只要发生或支付行为的都算',
          data: addUpData.accumulativePayUser,
        },
        {
          url: appImg,
          title: '累计打卡用户',
          tip: '指在全站累计打卡过的用户数，包括到店打卡或在哒小卡打卡。',
          data: addUpData.accumulativeMarkUser,
        },
        {
          url: appImg,
          title: '近3个月活跃用户',
          tip: '指近3个月在全站有行为记录的用户数，包括消费、打卡、看视频、玩游戏等。',
          data: addUpData.accumulativeActiveUser,
        },
      ],
    },
    {
      title: <div style={{ margin: '15px 0', fontSize: '20px' }}>平台用户注册来源</div>,
      showArr: [
        {
          url: appImg,
          title: 'APP',
          data: addUpData.accumulativeAppRegister,
        },
        {
          url: appImg,
          title: '哒小乐',
          data: addUpData.accumulativeWeChatRegister,
        },
        {
          url: appImg,
          title: '哒小团',
          data: addUpData.accumulativeCommunityRegister,
        },
        {
          url: appImg,
          title: '哒小卡',
          data: addUpData.accumulativeMarkRegister,
        },
      ],
    },
  ];

  return (
    <div>
      {dataList.map((cell, i) => (
        <React.Fragment key={`${i}`}>
          {cell.title}
          <Card>
            {cell.showArr.map((item) => (
              <Card.Grid key={item.title} style={gridStyle}>
                <div style={{ display: 'flex' }}>
                  <div style={{ ...imgStyle, backgroundImage: `url("${item.url}")` }}></div>
                  <div style={{ flex: 1 }}>
                    {item.tip ? (
                      <QuestionTooltip title={item.title} content={item.tip}></QuestionTooltip>
                    ) : (
                      item.title
                    )}
                    <div
                      style={{
                        fontSize: 24,
                        minWidth: 150,
                        fontWeight: 500,
                      }}
                    >
                      {item.data}
                    </div>
                  </div>
                </div>
              </Card.Grid>
            ))}
          </Card>
        </React.Fragment>
      ))}
    </div>
  );
};

export default connect(({ userDataStat }) => ({
  addUpData: userDataStat.addUpData,
}))(AccumulativeData);
