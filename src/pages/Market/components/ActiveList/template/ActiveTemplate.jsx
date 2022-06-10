import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Row, Col } from 'antd';
import template1 from './Img/template1.png';
import template2 from './Img/template2.png';
import template3 from './Img/template3.png';
import ActiveTemplateEdit from './ActiveTemplateEdit';
import ActiveTemplateNameSet from './ActiveTemplateNameSet';

const ActiveTemplate = () => {
  const [visible, setVisible] = useState({ show: false, info: {} });
  const [visibleName, setVisibleName] = useState({ show: false, info: { activityName: '' } });

  /**
   * 模版选项
   * @img 封面图片
   * @type 模版类型
   * @title 模版说明标题
   */
  const cardItem = [
    {
      img: template1,
      type: 'active', // oss 上传文件夹同名
      title: '支持定制各类节日、主题活动，包括商品类，券类，店铺类以及组合模板',
    },
    {
      img: template2,
      type: 'rule', // oss 上传文件夹同名
      title: '配置平台内各类活动规则、说明等模板内容',
    },
    {
      img: template3,
      type: 'globalModal', // oss 上传文件夹同名
      title: '配置App内全局弹窗',
    },
  ];

  // 选择活动 设置活动名称
  const handleSelectActive = (item) => setVisibleName({ show: true, info: item });

  // 输入活动名称回调
  const handleSetActiveName = (activityName) => {
    setVisibleName(false); // 关闭输入框
    setVisible({ show: true, info: { ...visibleName.info, activityName } }); // 显示模版编辑
  };

  return (
    <>
      <Card>
        <Row gutter={[20, 28]}>
          {cardItem.map((item) => (
            <Col key={item.type}>
              <Card
                cover={<img alt="example" src={item.img} style={{ width: 266, height: 160 }} />}
                actions={[<div onClick={() => handleSelectActive(item)}>使用模版</div>]}
                bodyStyle={{ maxWidth: 265, minHeight: 114 }}
              >
                {item.title}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      {/* 设置活动名称 */}
      <ActiveTemplateNameSet
        visible={visibleName}
        callback={handleSetActiveName}
        onClose={() => setVisibleName(false)}
      ></ActiveTemplateNameSet>
      {/* 活动模版编辑区域 */}
      <ActiveTemplateEdit
        key="template"
        visible={visible}
        onClose={() => setVisible(false)}
      ></ActiveTemplateEdit>
    </>
  );
};

export default connect()(ActiveTemplate);
