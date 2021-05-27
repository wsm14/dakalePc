import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import './style.less';

const GoodDetail = ({ data = {} }) => {
  const {
    activityGoodsImg = {},
    goodsName = '商品名称',
    merchantName = '店铺名称',
    oriPrice = 0,
    realPrice = 0,
    merchantPrice = 0,
    goodsDescImg = {},
    goodsDesc = '商品描述',
    discount = 0,
    packageGroupObjects = [], //套餐
  } = data;

  const { fileList: activityFileList = [] } = activityGoodsImg; // 商品轮播图
  const { fileList: decimglist = [] } = goodsDescImg; // 商品轮播图

  const [aFile, setAFile] = useState([]);
  const [decFile, setDecFile] = useState([]);

  useEffect(() => {
    const FileTime = setTimeout(() => {
      setAFile(activityFileList);
      setDecFile(decimglist);
      clearTimeout(FileTime);
    }, 500);
  }, [activityFileList.length]);

  useEffect(() => {
    const FileTime = setTimeout(() => {
      setDecFile(decimglist);
      clearTimeout(FileTime);
    }, 500);
  }, [decimglist.length]);

  const contentStyle = {
    height: 239,
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#ccc',
  };

  return (
    <div className="contextCOn">
      <Carousel autoplay>
        {aFile.length ? (
          aFile.map((item) => {
            return (
              <div key={item.name}>
                <div
                  style={{ ...contentStyle, background: `url(${item.thumbUrl}) center/cover` }}
                ></div>
              </div>
            );
          })
        ) : (
          <div>
            <div style={contentStyle}></div>
          </div>
        )}
      </Carousel>
      <div className="nameCon">
        <div className="priceCon">
          <span className="priceTile">哒卡乐专享价</span>
          <span className="priceNum">
            <i>￥</i>
            <i>{realPrice}</i>
            <i>¥ {oriPrice}</i>
          </span>
        </div>
        <div className="timesType">
          <span className="times">活动截止日期：2021.01.31</span>
          <span className="spec_span">门店抢购中</span>
        </div>
      </div>
      <div className="goods_dec">
        <div className="goods_tit">{goodsName ? goodsName : '商品名称'}</div>
        <div className="listChecked">
          <div className="items">
            <span className="imgs"></span>
            <span>免预约</span>
          </div>
          <div className="items">
            <span className="imgs"></span>
            <span>免预约</span>
          </div>
          <div className="quest"></div>
        </div>
        <div className="listGood_spec">
          <div className="item_spec">剩余120份</div>
          <div className="item_spec">每人限购1份</div>
        </div>
      </div>
      <div className="merchantCon">
        <span className="mechImg"></span>
        <div className="addressCon">
          <span>{merchantName}</span>
          <span>店铺地址</span>
        </div>
        <span className="moreImg"></span>
      </div>
      {/* 套餐内容，单品不展示 */}
      {packageGroupObjects && (
        <div className="teams_Con">
          <div className="titles">套餐详情</div>
          <div className="teamsList">
            {packageGroupObjects.map((items, ins) => {
              const data = items.packageGoodsObjects;
              return (
                <div className="item_teams" key={ins}>
                  <span className="groupNames">
                    · {items.groupName}
                    {data.length}
                  </span>
                  {data.length
                    ? data.map((itemsgood, index) => (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px',
                          }}
                        >
                          <span className="spec_names" key={itemsgood.goodsName}>
                            {itemsgood.goodsName}
                            {itemsgood.goodsNum}
                          </span>
                        { itemsgood.goodsPrice&& <span>￥ {itemsgood.goodsPrice}</span>}
                        </div>
                      ))
                    : ''}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="goods_Con spec">
        <div className="titles" style={{ padding: '0 14px' }}>
          商品描述
        </div>
        <div className="textCon" style={{ padding: '0 14px' }}>
          {goodsDesc}
        </div>
        {decFile.length ? (
          decFile.map((itemsimg) => (
            <img key={itemsimg.name} className="imgsGood" src={itemsimg.thumbUrl} alt="" />
          ))
        ) : (
          <div className="goodsimglist"></div>
        )}
        {/* <div className="goodsimglist">
        </div> */}
        {/* <div className="titles" style={{ marginLeft: '14px', marginTop: '18px' }}>
          哒人推荐
        </div>
        <div className="da_cons">
          <div className="da_imglist"></div>
          <div className="da_dec_con">
            <span className="title_da">
              <i className="sece_color">#为你探店</i>
            </span>
          </div>
        </div> */}
      </div>
      <div className="uesWays">
        <div className="titles" style={{ marginLeft: '14px' }}>
          使用方法
        </div>
        <div className="imgways"></div>
      </div>
      <div className="knowsCon">
        <div className="titles">使用须知</div>
        <div className="textCon">
          <div>
            <div style={{ marginBottom: '5px' }}>有效期：</div>
            <span>
              {' '}
              <i className="colorFon"> 2020.10.12 00:00:00 至 2020.12.12 23:59:59</i>
              ，请在有效期内使用；
            </span>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ marginBottom: '5px' }}>使用时间：</div>
            <span>
              <i className="colorFon">每周一、二、10:00 至 23:30</i>，具体以门店供应时段为准；
            </span>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={{ marginBottom: '5px' }}>购买须知：</div>
            <span>
              到店后，在APP/小程序我的—卡券中找到相应的券码，将
              券码出示给店员，直接验码核销，要补差价的另行补齐；
            </span>
          </div>
        </div>
      </div>
      <div className="knowsCon" style={{ marginBottom: '108px' }}>
        <div className="titles">购买须知</div>
        <div className="textCon textCons">
          <span>
            本券不可拆分使用，不支持外卖点餐、电商订购等；不可转让、转售、转发、截图，也不能兑换现金；不可伪造，伪造无效。
          </span>
          <span>本券一经核销即为使用，卡券详情可查看存根信息；</span>
          <span>
            如对订单有疑问，请到商家咨询，或者拨打哒卡乐官方客服电话：400-800-5881进行咨询。
          </span>
          <span>*最终解释权归杭州哒卡乐智能科技有限公司所有</span>
        </div>
      </div>
      <div className="bottomCon">
        <div className="bot_dec">
          <div className="lefts">
            <div style={{ height: '23px' }} className="items_bot">
              <span style={{ fontSize: '9px' }}>￥</span>
              <span style={{ fontSize: '23px', fontWeight: 'bold' }}>{realPrice}</span>
            </div>
            <div style={{ height: '11px' }} className="items_bot">
              <span style={{ fontSize: '11px', color: '#999999', textDecoration: 'line-through' }}>
                ￥ {oriPrice}
              </span>
              {(merchantPrice!=0 && oriPrice!=0) && (
                <span className="spec_d">{((merchantPrice / oriPrice) * 10).toFixed(2)}折</span>
              )}
            </div>
          </div>
          <div className="rightbtn">立即抢购</div>
        </div>
      </div>
    </div>
  );
};

export default GoodDetail;
