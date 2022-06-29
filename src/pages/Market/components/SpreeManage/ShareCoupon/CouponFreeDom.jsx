import { Badge } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { PLATFORM_TICKET_TYPE } from '@/common/constant';
import Ellipsis from '@/components/Ellipsis';

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
          className={`share_Coupon share_item ${id.includes(platformCouponId) && 'select'}`}
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
