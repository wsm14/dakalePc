import { setString } from './utils';
import oss from 'ali-oss';
import { HTTP_GET } from './request';

function getOss(url, obj) {
  return HTTP_GET(url, obj);
}

function uuid() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}
//獲取oss 後端憑證
function settingOss(obj, file) {
  let client = new oss({
    region: 'oss-cn-hangzhou',
    accessKeyId: obj.accessKeyId,
    accessKeySecret: obj.accessKeySecret,
    stsToken: obj.securityToken,
    bucket: obj.bucket,
  }); //sdk配置
  return new Promise((resolve) => {
    let fileName = setString(true, 4, 6);
    if (!/.*[\u4e00-\u9fa5]+.*$/.test(file['name'])) {
      fileName = obj['folder'] + '/' + fileName + file['name'];
    } else {
      fileName = obj['folder'] + '/' + uuid() + '.png';
    }
    client.put(fileName, file).then((res) => {
      res.fileName = fileName;
      resolve(res);
    });
  }); //设置异步请求回调
} //上传oss
function test(file, callback) {
  getOss('/common/oss/getOssPolicy', { uploadType: 'resource' }).then((res) => {
    const {
      data: { success },
    } = res;
    if (success) {
      const {
        data: { content },
      } = res;
      settingOss(content, file).then((result) => {
        const {
          res: { status, statusCode },
        } = result;
        if (status === 200 && statusCode === 200) {
          let url = {};
          url['url'] = content['host'] + result['fileName'];
          return callback(url);
        }
      });
    } else {
      return alert('提交参数有误');
    }
  });
  return;
} //拿到oss图片路径的回调

export default test;
