export enum RepairWarrantyHistoryStatus {
  RECEIVED = 'RECEIVED', // Đã tiếp nhận sản phẩm bảo hành từ khách
  CHECKING = 'CHECKING', // Kỹ thuật viên đang kiểm tra tình trạng lỗi
  IN_PROGRESS = 'IN_PROGRESS', // Đang tiến hành sửa chữa / thay thế linh kiện
  WAITING_PARTS = 'WAITING_PARTS', // Chờ linh kiện/phụ tùng để bảo hành
  COMPLETED = 'COMPLETED', // Đã hoàn thành bảo hành
  DELIVERED = 'DELIVERED', // Đã giao lại cho khách hàng
}
