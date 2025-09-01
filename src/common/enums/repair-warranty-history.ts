export enum RepairWarrantyHistoryStatus {
  RECEIVED = 'RECEIVED', // Đã tiếp nhận sản phẩm bảo hành từ khách
  CHECKING = 'CHECKING', // Kỹ thuật viên đang kiểm tra tình trạng lỗi
  IN_PROGRESS = 'IN_PROGRESS', // Đang tiến hành sửa chữa / thay thế linh kiện
  DONE_REPAIR = 'DONE_REPAIR', // Hoàn thành sửa chữa
  COMPLETED = 'COMPLETED', // Đã hoàn thành bảo hành
  NOTIFY_CUSTOMER = 'NOTIFY_CUSTOMER', // Báo khách nhân hàng
  REJECTED = 'REJECTED', // Báo khách nhân hàng
}
