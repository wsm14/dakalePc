import * as React from 'react';
import { Rule, RuleObject, RuleRender } from 'rc-field-form/lib/interface';

export declare type StoreValue = any;
export interface Store {
  [name: string]: StoreValue;
}

export interface FieldNamesType {
  value?: string | number;
  label?: string;
  children?: string;
}

export interface CascaderOptionType {
  value?: string | number;
  label?: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: Array<CascaderOptionType>;
  [key: string]: any;
}

export interface FormItems {
  type:
    | 'number'
    | 'textArea'
    | 'timePicker'
    | 'rangePicker'
    | 'select'
    | 'radio'
    | 'cascader'
    | 'upload';
  name: string;
  label: string;
  placeholder?: string;
  rules?: Rule[];
  addonAfter?: React.ReactNode | any;
  select?: string[] | { value: string | number; name: string | number } | CascaderOptionType;
  options?: FieldNamesType;
  initialValue?: string | number | any;
  extra: React.ReactNode;
  parentKeys?: string[];
}

interface FormCondition extends Partial<> {
  form?: any;
  formItems?: FormItems[];
  layout?: 'horizontal' | 'inline' | 'vertical';
  initialValues?: Store;
}
export default FormCondition;
