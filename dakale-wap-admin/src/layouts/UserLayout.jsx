import { DefaultFooter } from '@ant-design/pro-layout';
import FastClick from 'react-fastclick-alt';
import React from 'react';
import styles from './UserLayout.less';

const UserLayout = ({ children }) => {
  return (
    <FastClick>
      <div className={styles.dakale_user_container}>
        <div className={styles.dakale_user_top}>
          <div className={styles.dakale_user_title}>
            <div className={styles.dakale_user_logo}></div>
            <div className={styles.dakale_user_liner}></div>
            <div className={styles.dakale_user_font}>哒卡乐合伙查询系统</div>
          </div>
        </div>
        <div className={styles.dakale_user_content}>{children}</div>
        <DefaultFooter
          links={false}
          copyright={' 2020 杭州哒卡乐智能技术有限公司'}
          className={styles.dakale_footer}
        ></DefaultFooter>
      </div>
    </FastClick>
  );
};

export default UserLayout;
