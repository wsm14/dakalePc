import React from 'react';
import GoodDetail from './HtmlModel/GoodDetail';
import './style.less';

const Html5Simulate = ({ show, right = 650, data = {}, type = null }) => {
  console.log(data)
  const htmlBlock = {
    null: '',
    goods: <GoodDetail data={data || {}}></GoodDetail>,
  }[type];

  return (
    show && (
      <div
        style={{
          position: 'absolute',
          width: 337.5,
          height: 600.3,
          background:'#F5F5F5',
          top: '25%',
          transform: 'translate(0, -50%)',
          right: right + 150,
          zIndex: 10000,
          boxShadow: '-1px 2px 3px #585858',
          borderRadius: 3,
          wordWrap: 'break-word',
          overflowY: 'auto',
        }}
        className="html_simulate_box"
      >
        {htmlBlock}
      </div>
    )
  );
};

export default Html5Simulate;
