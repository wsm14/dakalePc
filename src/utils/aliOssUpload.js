import { notification } from 'antd';
import oss from 'ali-oss';
import request from './request';

/**
 * oss 文件上传
 * @param {*} file 本地文件流 数组或单文件
 * @param {*} return 返回Promise对象 .then返回 上传后的url数组
 */

const aliOssUpload = (fileArray = '') => {
  if (!fileArray) return false;
  // 获取oss凭证
  return request('/common/oss/getOssPolicy', {
    params: { uploadType: 'resource' },
  })
    .then((res) => {
      if (!res) return;
      const {
        content: { accessKeyId, accessKeySecret, securityToken: stsToken, bucket, folder, host },
      } = res;

      // oss sdk配置
      const client = new oss({
        region: 'oss-cn-hangzhou',
        accessKeyId,
        accessKeySecret,
        stsToken,
        bucket,
      });

      // oss 上传
      const ossput = (file) => {
        // 获取随机值
        let random = Math.random().toString(36).substr(2, 15);
        // 设置路径+随机文件名
        let fileName =
          folder + '/' + random + '_' + file['name'].replaceAll(/[\u4e00-\u9fa5]/g, '');
        return client.put(fileName, file).then((putres) => {
          const {
            res: { status, statusCode },
          } = putres;
          if (status === 200 && statusCode === 200) {
            return host + fileName;
          } else return false;
        });
      };

      return ossput;
    })
    .then(async (ossput) => {
      const fileUrlArray = [];
      if (Array.isArray(fileArray)) {
        for (const item of fileArray) {
          await ossput(item).then((res) => {
            if (!res) {
              notification.info({
                message: '温馨提示',
                description: '文件上传失败',
              });
              return;
            }
            fileUrlArray.push(res);
          });
        }
      } else {
        await ossput(fileArray).then((res) => {
          if (!res) {
            notification.info({
              message: '温馨提示',
              description: '文件上传失败',
            });
            return;
          }
          fileUrlArray.push(res);
        });
      }
      // 返回url数组
      return fileUrlArray;
    });
};

export default aliOssUpload;
