import React from 'react';
import './showDom.less';

// 回显dom
export default ({ richText, padding }) => {
  return (
    <div
      className="showHtml_richText"
      style={{ padding }}
      dangerouslySetInnerHTML={{ __html: richText }}
    ></div>
  );
};
