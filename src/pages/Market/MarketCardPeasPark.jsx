import React, { useState } from 'react';
import { Card } from 'antd';
import MarketCardRMing from './components/MarketCardRMing';
import MarketCardMorningDetail from './components/Morning/MarketCardMorningDetail';
import style from './styles.less';

const MarketCardPeasPark = () => {
  const [key, setKey] = useState('home');

  return (
    <>
      {
        {
          home: (
            <Card>
              <div className={style.park_box}>
                <div style={{ backgroundColor: '#f59a23' }} onClick={() => setKey('runing')}>
                  步数挑战赛
                </div>
                <div style={{ backgroundColor: '#bfbf00' }} onClick={() => setKey('morning')}>
                  早起挑战赛
                </div>
                <div style={{ backgroundColor: '#8080ff' }}>答题挑战</div>
                <div style={{ backgroundColor: '#ec808d' }}>卡豆果园</div>
                <div style={{ backgroundColor: '#c280ff' }}>节日主题</div>
                <div style={{ color: 'black', border: '1px solid #e6e6e6' }}>乐园公告</div>
                <div style={{ color: 'black', border: '1px solid #e6e6e6' }}>成就勋章</div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </Card>
          ),
          morning: <MarketCardRMing setKey={setKey} matchType="wakeUp" />,
          runing: <MarketCardRMing setKey={setKey} matchType="step" />,
          morningdetail: <MarketCardMorningDetail setKey={() => setKey('morning')} />,
        }[key]
      }
    </>
  );
};

export default MarketCardPeasPark;
