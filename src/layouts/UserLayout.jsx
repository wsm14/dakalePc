import { connect } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';
import Context from '@/pages/Login/LoginForm';
import React from 'react';
import styles from './UserLayout.less';

const UserLayout = (props) => {
  const isLoading = props.loading.effects['login/login'] || props.loading.effects['userInfo/fetchGetAuthMenuTree'];

  return (
    <div className={styles.dakale_user_container}>
      <div className={styles.dakale_user_top}>
        <div className={styles.dakale_user_title}>
          <div className={styles.dakale_user_logo}></div>
          <div className={styles.dakale_user_liner}></div>
          <div className={styles.dakale_user_font}>哒卡乐运营后台</div>
        </div>
      </div>
      <div className={styles.dakale_user_content}>
        <Context prop={props} style={styles} loading={isLoading}></Context>
      </div>
      <DefaultFooter
        links={false}
        copyright={' 2020 杭州哒卡乐智能技术有限公司'}
        className={styles.dakale_footer}
      ></DefaultFooter>
    </div>
  );
};

export default connect(({ settings, loading }) => ({ ...settings, loading }))(UserLayout);
