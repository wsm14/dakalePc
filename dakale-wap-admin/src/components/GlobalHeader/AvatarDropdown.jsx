import React from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Spin } from 'antd';
import { Popover } from 'antd-mobile';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const Item = Popover.Item;

class AvatarDropdown extends React.Component {
  state = {
    color: '000000',
  };

  onMenuClick = (opt) => {
    if (opt.props.value === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }
  };

  componentDidMount() {
    this.getRandomColor();
  }

  getRandomColor = () => {
    const rand = Math.floor(Math.random() * 0xffffff).toString(16);
    if (rand.length === 6) {
      this.setState({ color: rand });
      return;
    } else this.getRandomColor();
  };

  render() {
    const { color } = this.state;
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
    } = this.props;

    const menuHeaderDropdown = [
      <Item key="logout" value="logout">
        <LogoutOutlined style={{ marginRight: 10 }} />
        退出登录
      </Item>,
    ];
    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown} onSelect={this.onMenuClick}>
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
