/**
 * session 储存
 * keyObj 储存的所有key列表
 * get set remove clear
 */
const Profile = {};

// 本地储存列表
const keyObj = {
  currentUser: '登录用户信息',
  userId: '用户id',
  isMobile: '判断是否是手机',
  routerData: '路由',
};

// 设置某一个本地储存
Profile.set = (key, val) => {
  if (!keyObj[key]) {
    console.log(`set ${key}`, false);
    return false;
  }
  return sessionStorage.setItem(key, val);
};

// 获取某一个本地储存
Profile.get = (key) => {
  if (!keyObj[key]) {
    console.log(`get ${key}`, false);
    return false;
  }
  return sessionStorage.getItem(key);
};

// 删除某一个本地储存
Profile.remove = (key) => {
  if (!keyObj[key]) {
    console.log(`remove ${key}`, false);
    return false;
  }
  return sessionStorage.removeItem(key);
};

// 清空本地储存
Profile.clear = () => {
  sessionStorage.clear();
};

export default Profile;
