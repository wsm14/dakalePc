import { Badge } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

// 商品样式
export const goodsDom = (item = {}, id = '', setSelectItem, onDel) => {
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
    buyFlag,
    typeGoods,
  } = item;

  return (
    <div style={{ width: 350 }} key={activityGoodsId || specialGoodsId}>
      {/* <Badge.Ribbon text={{ single: '单品', package: '套餐' }[goodsType]}> */}
      <Badge.Ribbon
        text={
          typeGoods === 'goodsRight' ? '权益商品' : { single: '单品', package: '套餐' }[goodsType]
        }
      >
        <div
          className={`share_Coupon share_item ${id.includes(specialGoodsId) && 'select'}`}
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
                {buyFlag === '0' ? '免费 ' : `¥${realPrice} `}
                {/* ¥{realPrice}{' '} */}
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
