import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Row, Col } from 'antd';
import ActiveTemplateEdit from './components/template/ActiveTemplateEdit';
import ActiveTemplateNameSet from './components/template/ActiveTemplateNameSet';

const ActiveTemplate = () => {

  const [visible, setVisible] = useState({ show: false, info: {} });
  const [visibleName, setVisibleName] = useState({ show: false, info: {} });

  /**
   * 模版选项
   * @img 封面图片
   * @templateUrl 模版链接
   * @id 模版id
   * @title 模版说明标题
   */
  const cardItem = [
    {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
      templateUrl: `https://resource-new.dakale.net/dev/active/template/demo.html?demo=1&times=${new Date().getTime()}`,
      id: '1',
      title: '活动模版1',
    },
  ];

  // 选择活动
  const handleSelectActive = (item) => setVisibleName({ show: true, info: item });

  // 设置活动名称
  const handleSetActiveName = (activeName) => {
    setVisible({ show: true, info: { ...visibleName.info, activeName } });
    setVisibleName(false);
  };

  return (
    <>
      <Card>
        <Row gutter={[75, 28]}>
          {cardItem.map((item) => (
            <Col key={item.id}>
              <Card
                cover={<img alt="example" src={item.img} />}
                actions={[<div onClick={() => handleSelectActive(item)}>使用模版</div>]}
              >
                {item.title}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <ActiveTemplateEdit
        key="template"
        visible={visible}
        onClose={() => setVisible(false)}
      ></ActiveTemplateEdit>
      <ActiveTemplateNameSet
        visible={visibleName}
        callback={handleSetActiveName}
        onClose={() => setVisibleName(false)}
      ></ActiveTemplateNameSet>
    </>
  );
};

export default connect()(ActiveTemplate);
