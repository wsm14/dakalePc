import * as XLSX from 'xlsx';

/**
 * 导出excel 文件
 * @param {*} header 头部数组 {[key]:[name]}
 * @param {*} data 数据
 */
const exportExcel = ({ header = [], data = [] }) => {
  // 获取数据头部
  const headerObj = {};
  header.map((item) => {
    headerObj[item.header] = item.header;
  });
  // 获取数据列表
  const dataList = data.map((item) => {
    const newData = {};
    header.map((keys) => {
      // 值
      const rowData = item[keys.key];
      // 头
      const rowHeader = keys.header;
      // 值重置函数
      const rowRender = keys.render;
      // 数据key映射
      newData[rowHeader] = rowRender ? rowRender(rowData, item) : rowData;
    });
    return newData;
  });
  //创建book
  const wb = XLSX.utils.book_new();
  //json转sheet
  const ws = XLSX.utils.json_to_sheet([headerObj, ...dataList], {
    header: header.map((item) => item.header),
    skipHeader: true,
  });
  const timestamp = new Date().getTime();
  //sheet写入book
  XLSX.utils.book_append_sheet(wb, ws, 'file');
  //输出
  XLSX.writeFile(wb, 'file' + timestamp + '.xlsx');
};

export default exportExcel;
