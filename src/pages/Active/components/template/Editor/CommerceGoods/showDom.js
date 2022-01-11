import React from 'react';

// 回显dom
export default ({ styleIndex = 0, list = [] }) => {
  const disFlexAC = {
    display: 'flex',
    alignItems: 'center',
  };

  return [
    <div style={{ padding: '4px 12px 16px 12px' }}>
      {list.map((item) => {
        const {
          paymentModeObject: { type, bean, cash },
        } = item;
        return (
          <div
            key={item.specialGoodsId}
            style={{
              padding: 8,
              marginTop: 12,
              borderRadius: 4,
              ...disFlexAC,
              width: '100%',
              background: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: 112,
                height: 112,
                marginRight: 8,
                borderRadius: 4,
                background: `url(${item.goodsImg}) center/cover`,
              }}
            ></div>
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: 112,
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: '#333333',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.goodsName}
              </div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, marginTop: 16, color: '#999999' }}>
                    原价: <span style={{ textDecoration: 'line-through' }}>¥{item.oriPrice}</span>
                  </div>
                  {type === 'self' ? (
                    <div style={{ lintHeight: 1 }}>
                      <div
                        style={{
                          fontSize: 10,
                          borderRadius: 2,
                          border: '1px solid #EF476F',
                          color: '#EF476F',
                          padding: '2px 3px',
                          margin: '5px 0 4px',
                          width: 'max-content',
                        }}
                      >
                        卡豆价
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          color: '#EF476F',
                          fontWeight: 'bold',
                        }}
                      >
                        ¥{cash}+{bean} <span style={{ fontSize: 13 }}>卡豆</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 12, marginTop: 7, color: '#333333' }}>
                        优惠价:
                        <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥{item.realPrice}</span>
                      </div>
                      <div
                        style={{
                          height: 16,
                          marginTop: 6,
                          borderRadius: 8,
                          border: '1px solid #ef476f',
                          display: 'inline-flex',
                          alignItems: 'center',
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            ...disFlexAC,
                            height: 'inherit',
                            background: '#ef476f',
                            fontSize: 10,
                            color: '#ffffff',
                            paddingLeft: 4,
                            paddingRight: 3,
                          }}
                        >
                          卡豆再省
                        </div>
                        <div
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: '16px solid #ef476f',
                            borderRight: '2px solid transparent',
                          }}
                        ></div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: '#ef476f',
                            background: '#ffffff',
                            borderRadius: '0px 50px 50px 0px',
                            paddingRight: 4,
                          }}
                        >
                          ￥0
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 27,
                    fontSize: 14,
                    borderRadius: 13,
                    ...disFlexAC,
                    color: '#FFFFFF',
                    background: '#EF476F',
                    justifyContent: 'center',
                  }}
                >
                  抢购
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>,
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexWrap: 'wrap',
      }}
    >
      {list.map((item) => {
        const {
          paymentModeObject: { type, bean, cash },
        } = item;
        return (
          <div
            key={item.specialGoodsId}
            style={{
              width: 172,
              background: '#FFFFFF',
              borderRadius: 4,
              marginBottom: 12,
              padding: '4px 4px 12px',
            }}
          >
            <div
              style={{
                width: 164,
                height: 122,
                borderRadius: 2,
                background: `url(${item.goodsImg}) center/cover`,
              }}
            ></div>
            <div style={{ padding: '12px 4px 0' }}>
              <div
                style={{
                  fontSize: 14,
                  color: '#333333',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.goodsName}
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: '#999999',
                  lineHeight: 'initial',
                }}
              >
                原价: <span style={{ textDecoration: 'line-through' }}>¥{item.oriPrice}</span>
              </div>
              {type === 'self' ? (
                <div style={{ lintHeight: 1 }}>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 10,
                      borderRadius: 2,
                      border: '1px solid #EF476F',
                      color: '#EF476F',
                      padding: '2px 3px',
                      margin: '5px 0 4px',
                      width: 'max-content',
                    }}
                  >
                    卡豆价
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: '#EF476F',
                      fontWeight: 'bold',
                    }}
                  >
                    ¥{cash}+{bean} <span style={{ fontSize: 13 }}>卡豆</span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    color: '#333333',
                    lineHeight: 'initial',
                  }}
                >
                  <div>
                    优惠价：
                    <span style={{ fontSize: 14, fontWeight: 'bold' }}>¥{item.realPrice}</span>
                  </div>
                  <div
                    style={{
                      height: 16,
                      marginTop: 4,
                      borderRadius: 8,
                      border: '1px solid #ef476f',
                      display: 'inline-flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        ...disFlexAC,
                        height: 'inherit',
                        background: '#ef476f',
                        fontSize: 10,
                        color: '#ffffff',
                        paddingLeft: 4,
                        paddingRight: 3,
                      }}
                    >
                      卡豆再省
                    </div>
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: '16px solid #ef476f',
                        borderRight: '2px solid transparent',
                      }}
                    ></div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#ef476f',
                        background: '#ffffff',
                        borderRadius: '0px 50px 50px 0px',
                        paddingRight: 4,
                      }}
                    >
                      ￥0
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  width: 154,
                  height: 27,
                  fontSize: 14,
                  marginTop: 16,
                  borderRadius: 13,
                  ...disFlexAC,
                  color: '#FFFFFF',
                  background: '#EF476F',
                  justifyContent: 'center',
                }}
              >
                抢购
              </div>
            </div>
          </div>
        );
      })}
    </div>,
  ][styleIndex];
};
