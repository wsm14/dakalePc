import * as XLSX from 'xlsx';

/**
 * 导出excel 文件
 * @param {*} header 头部数组 {[key]:[name]}
 * @param {*} data 数据
 * @param {*} fileName 导出的文件名
 * @param {*} filterData ['序号'] 需要过滤的数据 header
 * @param {*} fieldNames 数据别名
 */
const exportExcel = ({
  header = [],
  data = [],
  fileName = 'file',
  fieldNames = {},
  filterData = ['序号'],
}) => {
  const { key = 'dataIndex', headerName = 'title' } = fieldNames;
  // 过滤导出 header
  const newheader = header.filter((item) => !filterData.includes(item[headerName]));
  // 获取数据头部
  const headerObj = {};
  newheader.map((item) => {
    headerObj[item[headerName]] = item[headerName];
  });
  // 获取数据列表
  const dataList = data.map((item) => {
    const newData = {};
    newheader.map((keys) => {
      // 值
      const rowData = item[keys[key]];
      // 头
      const rowHeader = keys[headerName];
      // 值重置函数
      const rowRender = keys.render;

      const rowRenderData = rowRender ? rowRender(rowData, item) : rowData;

      // 数据key映射
      newData[rowHeader] = typeof rowRenderData == 'string' ? rowRenderData : rowData;
    });
    return newData;
  });
  //创建book
  const wb = XLSX.utils.book_new();
  //json转sheet
  const ws = XLSX.utils.json_to_sheet([headerObj, ...dataList], {
    header: newheader.map((item) => item[headerName]),
    skipHeader: true,
  });
  const timestamp = new Date().toLocaleString();
  //sheet写入book
  XLSX.utils.book_append_sheet(wb, ws, 'file');
  //输出
  XLSX.writeFile(wb, fileName + '_' + timestamp + '.xlsx');
};

export default exportExcel;
