import React from 'react';
import { Typography, Image } from 'antd';
import { PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import './style.less';

/**
 * 商家信息
 */
const MreDetail = ({ detail }) => {
  // 商家信息解构
  const {
    merchantName,
    topCategoryName,
    categoryName,
    telephone,
    address,
    salesperson,
    businessTime,
    coverImg,
    allImgs,
  } = detail;

  return (
    <div className="chart_amp_mreInfo">
      <div className="chart_amp_mreInfo_heard">
        <Typography.Title level={4} className="title">
          {merchantName || '--'}
        </Typography.Title>
        <div className="chart_amp_mreInfo_item">
          {topCategoryName} / {categoryName}
        </div>
        <div className="chart_amp_mreInfo_item">
          <div className="chart_amp_mreInfo_icon">
            <PhoneOutlined />
          </div>
          <div className="chart_amp_mreInfo_text"> {telephone || '--'}</div>
        </div>
        <div className="chart_amp_mreInfo_item">
          <div className="chart_amp_mreInfo_icon">
            <EnvironmentOutlined />
          </div>
          <div className="chart_amp_mreInfo_text">{address || '--'}</div>
        </div>
      </div>
      <div className="chart_amp_mreInfo_content">
        <p className="merInfo_sale">关联商拓：{salesperson || '--'}</p>
        <p>营业时间：{businessTime || '--'}</p>
        <p>相册</p>
        <div className="mreInfo_img">
          <div className="mreInfo_img_item">
            <Image width={102} height={102} src={coverImg} className="descript_img" />
          </div>
          {allImgs
            ? allImgs.split(',').map((item) => (
                <div className="mreInfo_img_item">
                  <Image width={102} height={102} src={item} className="descript_img" />
                </div>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
};

export default MreDetail;
