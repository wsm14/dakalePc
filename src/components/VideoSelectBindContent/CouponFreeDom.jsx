import { Badge } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

// 优惠券样式
export const couponsDom = (item = {}, id, setSelectItem, type = 'free', onDel) => {
  const {
    reduceObject = {},
    couponName,
    remain,
    buyPrice, // 售卖价格
    ownerCouponIdString = '',
    ownerCouponId,
    activeDateStr, //  使用有效期-固定时间-开始时间
    activeDate,
    endDateStr, //  使用有效期-固定时间-结束时间
    endDate,
    delayDays = 0, // 使用有效期-领取后-延迟生效天数
    activeDays, // 使用有效期-领取后-有效天数
  } = item;
  const { couponPrice, thresholdPrice = '' } = reduceObject;
  return (
    <div style={{ width: 350 }} key={ownerCouponId || ownerCouponIdString}>
      <Badge.Ribbon text={{ free: '免费券', valuable: '抵扣券' }[type]}>
        <div
          className={`share_Coupon share_item ${id === ownerCouponIdString && 'select'}`}
          style={{ marginBottom: 6 }}
          onClick={() => setSelectItem && setSelectItem(item)}
        >
          <div className="share_left">
            价值￥{couponPrice}
            <br></br>
            {buyPrice ? `￥${buyPrice}` : ''}
          </div>
          <div className="share_title">
            <div className="titile">{couponName}</div>
            <div className="share_tip">
              {(activeDateStr && endDateStr) || (activeDate && endDate)
                ? `有效期：${activeDateStr || activeDate} - ${endDateStr || endDate}`
                : delayDays != 0
                ? `领取后${delayDays}天生效｜有效期${activeDays}天`
                : `有效期：领取后${activeDays}天内`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="share_tip">
                {thresholdPrice ? `满${thresholdPrice}元可用` : '无门槛'}
              </div>
              <div className="share_tip" style={{ color: '#b1b1b1' }}>
                剩余{remain}张
              </div>
            </div>
          </div>
          {!onDel ? (
            <div className="share_select_icon">
              <div className="share_select"></div>
            </div>
          ) : (
            <div className="share_del_icon" onClick={onDel}>
              <DeleteOutlined />
            </div>
          )}
        </div>
      </Badge.Ribbon>
    </div>
  );
};

// 商品样式
export const goodsDom = (item = {}, id, setSelectItem, onDel) => {
  const {
    goodsImg,
    goodsName = '',
    remain,
    specialGoodsId,
    activityGoodsId,
    realPrice,
    oriPrice,
    goodsType = 'single',
    activityTimeRule = 'infinite',
    activityStartTime,
    activityEndTime,
  } = item;

  return (
    <div style={{ width: 350 }} key={activityGoodsId || specialGoodsId}>
      <Badge.Ribbon text={{ single: '单品', package: '套餐' }[goodsType]}>
        <div
          className={`share_Coupon share_item ${id === specialGoodsId && 'select'}`}
          style={{ marginBottom: 6 }}
          onClick={() => setSelectItem && setSelectItem(item)}
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
          {!onDel ? (
            <div className="share_select_icon">
              <div className="share_select"></div>
            </div>
          ) : (
            <div className="share_del_icon" onClick={onDel}>
              <DeleteOutlined />
            </div>
          )}
        </div>
      </Badge.Ribbon>
    </div>
  );
};

// 电商商品样式
export const commerceDom = (item = {}, id, setSelectItem, onDel) => {
  const {
    goodsImg,
    goodsName = '',
    remain,
    specialGoodsId,
    activityGoodsId,
    realPrice,
    oriPrice,
    goodsType = 'single',
    paymentModeObject = {},
    activityTimeRule = 'infinite',
    activityStartTime,
    activityEndTime,
  } = item;

  return (
    <div style={{ width: 350 }} key={activityGoodsId || specialGoodsId}>
      <Badge.Ribbon text={{ single: '单品', package: '套餐' }[goodsType]}>
        <div
          className={`share_Coupon share_item ${id === specialGoodsId && 'select'}`}
          style={{ marginBottom: 6 }}
          onClick={() => setSelectItem && setSelectItem(item)}
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
            {/* <div className="share_tip">
              活动时间：
              {
                { fixed: `${activityStartTime} - ${activityEndTime}`, infinite: '长期' }[
                  activityTimeRule
                ]
              }
            </div> */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="share_tip">
                ¥{paymentModeObject.cash}
                {paymentModeObject.bean == 0 ? '' : <span>+{paymentModeObject.bean}卡豆</span>}
              </div>
              <div className="share_tip" style={{ color: '#b1b1b1' }}>
                剩余{remain}张
              </div>
            </div>
          </div>
          {!onDel ? (
            <div className="share_select_icon">
              <div className="share_select"></div>
            </div>
          ) : (
            <div className="share_del_icon" onClick={onDel}>
              <DeleteOutlined />
            </div>
          )}
        </div>
      </Badge.Ribbon>
    </div>
  );
};
