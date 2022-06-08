import { Badge } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Ellipsis from '@/components/Ellipsis';
import { PLATFORM_TICKET_TYPE } from '@/common/constant';
import './coupon.less';

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

// 平台券样式
export const platformCouponsDom = (item = {}, id = '', setSelectItem, onDel) => {
  const {
    platformCouponId = '',
    couponValue, // 券价值
    thresholdPrice, // 门槛
    useScenesType,
    classType,
    couponName,
    remain,
    activeDateStr, //  使用有效期-固定时间-开始时间
    activeDate,
    endDateStr, //  使用有效期-固定时间-结束时间
    endDate,
    delayDays = 0, // 使用有效期-领取后-延迟生效天数
    activeDays, // 使用有效期-领取后-有效天数
  } = item;
  return (
    <div style={{ width: 350 }} key={platformCouponId}>
      <Badge.Ribbon text={'平台券'}>
        <div
          className={`share_Coupon share_item ${id === platformCouponId && 'select'}`}
          style={{ marginBottom: 6 }}
          onClick={() => setSelectItem && setSelectItem(item)}
        >
          <div className="pCoupon_share_left">
            <div className="pCoupon_share_left_top">
              ￥<div className="pCoupon_price">{couponValue}</div>
            </div>
            <div className="pCoupon_share_left_bottom">{`满${thresholdPrice}元可用`}</div>
          </div>
          <div className="share_title">
            <div>
              <span className="pCoupon_tit_type">{`${PLATFORM_TICKET_TYPE[useScenesType][classType]}`}</span>
              <span className="titile">
                <Ellipsis length={9} tooltip>
                  {couponName}
                </Ellipsis>
              </span>
            </div>
            <div className="share_tip">
              {(activeDateStr && endDateStr) || (activeDate && endDate)
                ? `${activeDateStr || activeDate} - ${endDateStr || endDate}`
                : delayDays != 0
                ? `领取后${delayDays}天生效｜有效期${activeDays}天`
                : `有效期：领取后${activeDays}天内`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="share_tip">{platformCouponId}</div>
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
    sellPrice,
    oriPrice,
    productType = 'single',
    activityTimeRule = 'infinite',
    activityStartDate,
    activityEndDate,
    buyFlag,
    inputDom = null,
  } = item;

  return (
    <div style={{ width: 350 }} key={activityGoodsId || specialGoodsId}>
      <Badge.Ribbon text={{ single: '单品', package: '套餐' }[productType]}>
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
          <div className="share_title" style={{ lineHeight: 1.6 }}>
            <div className="titile">{goodsName}</div>
            <div className="share_tip">
              活动时间：
              {
                { fixed: `${activityStartDate} - ${activityEndDate}`, infinite: '长期' }[
                  activityTimeRule
                ]
              }
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="share_tip">
                {buyFlag === '0' ? '免费 ' : `¥${sellPrice} `}
                <span style={{ textDecoration: 'line-through', color: '#9e9e9e' }}>
                  ￥{oriPrice}
                </span>
              </div>
              <div className="share_tip" style={{ color: '#b1b1b1' }}>
                剩余{remain}张
              </div>
            </div>
            {inputDom && inputDom()}
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
    sellPriceRange = 0,
    activityTimeRule = 'infinite',
    activityStartTime,
    activityEndTime,
  } = item;

  return (
    <div style={{ width: 350 }} key={activityGoodsId || specialGoodsId}>
      <Badge.Ribbon text={'电商商品'}>
        <div
          className={`share_Coupon share_item ${id === activityGoodsId && 'select'}`}
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
              <div className="share_tip">{sellPriceRange}元</div>
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

// 拼团商品
export const groupGoods = (item = {}, id, setSelectItem, onDel) => {
  const {
    goodsImg,
    goodsName = '',
    remain,
    specialGoodsId,
    activityGoodsId,
    realPrice,
    oriPrice,
    goodsId,
  } = item;

  return (
    <div style={{ width: 350 }} key={activityGoodsId || specialGoodsId}>
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
          <div style={{ color: '#999' }}>ID:{goodsId}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="share_tip">
              ¥{realPrice}{' '}
              <span style={{ textDecoration: 'line-through', color: '#9e9e9e' }}>￥{oriPrice}</span>
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
    </div>
  );
};
