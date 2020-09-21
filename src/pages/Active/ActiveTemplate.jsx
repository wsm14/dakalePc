import React, { useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col } from 'antd';
import ActiveTemplateEdit from './components/template/ActiveTemplateEdit';
import activeTemplateNameSet from './components/template/ActiveTemplateNameSet';

const ActiveTemplate = (props) => {
  const { dispatch } = props;

  const [visible, setVisible] = useState({ show: false, info: {} });

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
      templateUrl: 'https://resource-new.dakale.net/dev/active/template/demo.html',
      id: '1',
      title: '活动模版1',
    },
  ];

  // 设置活动名称
  const handleSetActiveName = (item) => {
    const callback = (activeName) => {
      setVisible({ show: true, info: { ...item, activeName } });
      dispatch({ type: 'drawerForm/close' });
    };
    dispatch({
      type: 'drawerForm/show',
      payload: activeTemplateNameSet({ callback }),
    });
  };

  return (
    <>
      <Card>
        <Row gutter={[75, 28]}>
          {cardItem.map((item) => (
            <Col key={item.id}>
              <Card
                cover={<img alt="example" src={item.img} />}
                actions={[<div onClick={() => handleSetActiveName(item)}>使用模版</div>]}
              >
                {item.title}
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <ActiveTemplateEdit visible={visible} onClose={() => setVisible(false)}></ActiveTemplateEdit>
    </>
  );
};

export default connect()(ActiveTemplate);
