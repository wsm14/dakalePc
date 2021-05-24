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
  console.log({
    header,
    data,
    fileName,
    fieldNames,
    fieldRender,
    filterData,
  });
  // 逐级获取value
  const getArrKeyVal = (rowkey, rowData) => {
    const _len = rowkey.length;
    let newVal = rowData;
    for (let _key = 0; _key < _len; _key++) {
      // 当数组key 获取值时某一层不存在时直接返回null
      const valGet = newVal ? newVal[rowkey[_key]] : '';
      newVal = valGet ? valGet : '';
    }
    return newVal;
  };

  // 获取参数值判断
  const getRowVale = (rowkey, rowData) => {
    // 参数名判断 若是数组则逐级获取参数
    return Array.isArray(rowkey) ? getArrKeyVal(rowkey, rowData) : rowData[rowkey];
  };

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
      const tdData = getRowVale(keys[key], row); // 值
      const rowHeader = keys[headerName]; // 头
      const rowRender = fieldRender[keys[key]] || keys.render; // 值重置函数
      const rowRenderData = rowRender ? rowRender(tdData, row) : tdData;
      newData[rowHeader] = rowRenderData;
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
