// 商品样式
export const goodsDom = (item = {}, idArr = [], handleSelect) => {
  const {
    goodsImg,
    goodsName = '',
    remain,
    specialGoodsId,
    realPrice,
    oriPrice,
    paymentModeObject: { type, bean, cash },
  } = item;
  return (
    <div style={{ width: 350 }} key={specialGoodsId}>
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
          <div className="share_tip">¥{type === 'self' ? `${cash} + ${bean} 卡豆` : realPrice}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="share_tip">
              <span style={{ textDecoration: 'line-through', color: '#9e9e9e' }}>￥{oriPrice}</span>
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
    </div>
  );
};
