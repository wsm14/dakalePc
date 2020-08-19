import React, { useState } from 'react';
import { Card, Badge } from 'antd';
import MarketCardRMing from './components/RMing/MarketCardRMing';
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
                <div
                  className={style.park_item}
                  style={{ backgroundColor: '#f59a23' }}
                  onClick={() => setKey('runing')}
                >
                  步数挑战赛
                </div>
                <div
                  className={style.park_item}
                  style={{ backgroundColor: '#bfbf00' }}
                  onClick={() => setKey('morning')}
                >
                  早起挑战赛
                </div>
                <Badge.Ribbon text="开发中">
                  <div
                    className={`${style.park_item} ${style.park_item_no} `}
                    style={{ backgroundColor: '#8080ff' }}
                  >
                    答题挑战
                  </div>
                </Badge.Ribbon>
                <Badge.Ribbon text="开发中">
                  <div
                    className={`${style.park_item} ${style.park_item_no} `}
                    style={{ backgroundColor: '#ec808d' }}
                  >
                    卡豆果园
                  </div>
                </Badge.Ribbon>
                <Badge.Ribbon text="开发中">
                  <div
                    className={`${style.park_item} ${style.park_item_no} `}
                    style={{ backgroundColor: '#c280ff' }}
                  >
                    节日主题
                  </div>
                </Badge.Ribbon>
                <div
                  className={style.park_item}
                  style={{ color: 'black', border: '1px solid #e6e6e6' }}
                >
                  乐园公告
                </div>
                <Badge.Ribbon text="开发中">
                  <div
                    className={`${style.park_item} ${style.park_item_no} `}
                    style={{ color: 'black', border: '1px solid #e6e6e6' }}
                  >
                    成就勋章
                  </div>
                </Badge.Ribbon>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </Card>
          ),
          morning: <MarketCardRMing setKey={setKey} matchType="wakeUp" />,
          runing: <MarketCardRMing setKey={setKey} matchType="step" />,
          notice: <MarketCardRMing setKey={setKey} matchType="step" />,
        }[key]
      }
    </>
  );
};

export default MarketCardPeasPark;
