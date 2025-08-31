export type RefConfig = 'Order' | 'Product' | 'Category' | 'Brand';
export type ActionTypeConfig =
  | 'CREATE'
  | 'ORDER'
  | 'CONFRIM'
  | 'CANCEL'
  | 'REPORT'
  | 'IMPORT'
  | 'ASSIGN'
  | 'UPDATE'
  | 'DELETE'
  | 'DONE'
  | 'DONE_REPAIR'
  | 'NOTI'
  | 'RETURN';

export enum ActionLogType {
  CREATE = 'CREATE',
  ORDER = 'ORDER',
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
  REPORT = 'REPORT',
  ASSIGN = 'ASSIGN',
  IMPORT = 'IMPORT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RETURN = 'RETURN',
  DONE = 'DONE',
  DONE_REPAIR = 'DONE_REPAIR',
  NOTI = 'NOTI',
}
