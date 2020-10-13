import React from 'react';
import { LogoutOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  state = {
    color: '000000',
  };

  onMenuClick = (event) => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/password`);
  };

  componentDidMount() {
    this.getRandomColor();
  }

  getRandomColor = () => {
    const rand = Math.floor(Math.random() * 0xffffff).toString(16);
    if (rand.length === 6) {
      return this.setState({ color: rand });
    }
    return this.getRandomColor();
  };

  render() {
    const { color } = this.state;
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        <Menu.Item key="settings">
          <LockOutlined />
          修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            icon={<UserOutlined />}
            size="small"
            className={styles.avatar}
            style={{
              backgroundColor: `#${color}`,
              color: '#ffffff',
            }}
            alt="avatar"
          />
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.allImgs} alt="avatar" /> */}
          <span className={`${styles.name} anticon`}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ userInfo }) => ({
  currentUser: userInfo.currentUser,
}))(AvatarDropdown);
