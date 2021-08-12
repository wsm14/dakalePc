export const delectProps = (data) => {
  const divProps = Object.assign({}, data);

  /**
   * React does not recognize the `***` prop on a DOM element.
   * If you intentionally want it to appear in the DOM as a custom attribute,
   * spell it as lowercase `***` instead.
   * If you accidentally passed it from a parent component,
   * remove it from the DOM element.
   * */

  delete divProps.fieldNames;
  delete divProps.initialvalues;
  delete divProps.formItem;
  delete divProps.name;
  delete divProps.select;
  delete divProps.visible;
  delete divProps.addRules;
  delete divProps.loading;
  delete divProps.type;
  delete divProps.maxFile;
  delete divProps.maxSize;
  delete divProps.isCut;
  delete divProps.imgRatio;
  delete divProps.addonAfter;
  delete divProps.render;
  delete divProps.show;
  delete divProps.label;
  delete divProps.form;
  delete divProps.normalize;
  delete divProps.cityType;
  delete divProps.showTitle;
  delete divProps.wrapperCol;

  return divProps;
};

export const delectFormProps = (data) => {
  const divProps = Object.assign({}, data);

  /**
   * React does not recognize the `****` prop on a DOM element.
   * If you intentionally want it to appear in the DOM as a custom attribute,
   * spell it as lowercase `****` instead.
   * If you accidentally passed it from a parent component,
   * remove it from the DOM element.
   * */

  delete divProps.fieldNames;
  delete divProps.initialvalues;
  delete divProps.formItem;
  delete divProps.name;
  delete divProps.select;
  delete divProps.visible;
  delete divProps.addRules;
  delete divProps.loading;
  delete divProps.type;
  delete divProps.maxFile;
  delete divProps.maxSize;
  delete divProps.isCut;
  delete divProps.imgRatio;
  delete divProps.addonAfter;
  delete divProps.render;
  delete divProps.show;
  delete divProps.onChange;
  delete divProps.onRemove;
  delete divProps.changeOnSelect;
  delete divProps.showTime;
  delete divProps.disabledDate;
  delete divProps.onPressEnter;
  delete divProps.onSearch;
  delete divProps.formatter;
  delete divProps.order;
  delete divProps.onCalendarChange;
  delete divProps.checkedChildren;
  delete divProps.unCheckedChildren;
  delete divProps.allowClear;

  return divProps;
};
