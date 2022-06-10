import { Badge } from 'antd';

// 商品样式
export const goodsDom = (item = {}, idArr = [], handleSelect) => {
  const {
    goodsImg,
    goodsName = '',
    remain,
    specialGoodsId,
    realPrice,
    oriPrice,
    goodsType = 'single',
    activityTimeRule = 'infinite',
    activityStartTime,
    activityEndTime,
  } = item;
  return (
    <div style={{ width: 350 }} key={specialGoodsId}>
      <Badge.Ribbon text={{ single: '单品', package: '套餐' }[goodsType]}>
        <div
          className={`share_Coupon share_item ${
            idArr.findIndex((ci) => ci.specialGoodsId === specialGoodsId) > -1 && 'select'
          }`}
          onClick={() => handleSelect && handleSelect(item)}
        >
          <div
            className="share_left"
            style={{
              width: 76,
              height: 76,
              background: `url(${goodsImg}) 100%/cover`,
            }}
          ></div>
          <div className="share_title" style={{ lineHeight: 1.8 }}>
            <div className="titile">{goodsName}</div>
            <div className="share_tip">
              活动时间：
              {
                { fixed: `${activityStartTime} - ${activityEndTime}`, infinite: '长期' }[
                  activityTimeRule
                ]
              }
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="share_tip">
                ¥{realPrice}{' '}
                <span style={{ textDecoration: 'line-through', color: '#9e9e9e' }}>
                  ￥{oriPrice}
                </span>
              </div>
              <div className="share_tip" style={{ color: '#b1b1b1' }}>
                剩余{remain}张
              </div>
            </div>
          </div>
          <div className="share_select_icon">
            <div className="share_select"></div>
          </div>
        </div>
      </Badge.Ribbon>
    </div>
  );
};
