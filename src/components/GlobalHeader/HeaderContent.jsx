import React from 'react';
import { connect } from 'umi';
import RightContent from './RightContent';
import KeepAliveTabs from './KeepAliveTabs';
import styles from './index.less';

const HeaderContent = (props) => {
  let className = styles.left;

  return (
    <div className={className}>
      <div style={{ flex: 1, overflow: 'hidden', marginTop: 9 }}>
        <KeepAliveTabs></KeepAliveTabs>
      </div>
      <RightContent {...props}></RightContent>
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(HeaderContent);
