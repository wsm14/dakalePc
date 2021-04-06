import * as XLSX from 'xlsx';

/**
 * 导出excel 文件
 * @param {*} header 头部数组 object { [key]: [name] }
 * @param {*} data 数据 object[] []
 * @param {*} fileName 导出的文件名 string 'file'
 * @param {*} filterData 需要过滤的数据 string[] ['序号']
 * @param {*} fieldRender 重定义render object { [dataIndex]: (tdData, row) => () }
 * @param {*} fieldNames 数据别名 object { key = 'dataIndex', headerName = 'title' }
 */
const exportExcel = ({
  header = [],
  data = [],
  fileName = 'file',
  fieldNames = {},
  fieldRender = {},
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
  const dataList = data.map((row) => {
    const newData = {};
    newheader.map((keys) => {
      const tdData = row[keys[key]]; // 值
      const rowHeader = keys[headerName]; // 头
      const rowRender = fieldRender[keys[key]] || keys.render; // 值重置函数
      const rowRenderData = rowRender ? rowRender(tdData, row) : tdData;
      newData[rowHeader] = typeof rowRenderData == 'string' ? rowRenderData : tdData; // 数据key映射
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
