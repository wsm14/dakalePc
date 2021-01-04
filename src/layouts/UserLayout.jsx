import { DefaultFooter } from '@ant-design/pro-layout';
import React from 'react';
import { Tag } from 'antd';
import styles from './UserLayout.less';

// 环境区分
const ENVTagColor = {
  dev: 'orange',
  test: 'green',
};

const UserLayout = ({ children }) => {
  return (
    <div className={styles.dakale_user_container}>
      <div className={styles.dakale_user_top}>
        <div className={styles.dakale_user_title}>
          <div className={styles.dakale_user_logo}></div>
          <div className={styles.dakale_user_liner}></div>
          <div className={styles.dakale_user_font}>
            哒卡乐运营后台
            {REACT_APP_ENV !== 'prod' && (
              <span>
                <Tag color={ENVTagColor[REACT_APP_ENV || 'dev']}>{REACT_APP_ENV || 'dev'}</Tag>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.dakale_user_content}>{children}</div>
      <DefaultFooter
        links={false}
        copyright={' 2020 杭州哒卡乐智能技术有限公司'}
        className={styles.dakale_footer}
      ></DefaultFooter>
    </div>
  );
};

export default UserLayout;
