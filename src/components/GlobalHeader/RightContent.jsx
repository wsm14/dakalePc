import React from 'react';
import { Tag } from 'antd';
import { connect } from 'umi';
import Avatar from './AvatarDropdown';
import ExcelWrite from './ExcelWrite';
import styles from './index.less';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
};

const GlobalHeaderRight = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <ExcelWrite />
      <Avatar />
      {REACT_APP_ENV !== 'prod' && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV || 'dev']}>{REACT_APP_ENV || 'dev'}</Tag>
        </span>
      )}
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
