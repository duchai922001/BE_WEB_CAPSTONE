export enum WarrantyRequestStatus {
  RECEIVE = 'RECEIVE', // Cửa hàng nhận máy
  SENT_TO_BRAND = 'SENT_TO_BRAND', // Đã gửi qua hãng/TTBH
  AT_BRAND_CHECKING = 'AT_BRAND_CHECKING',
  AT_BRAND_REPAIRING = 'AT_BRAND_REPAIRING',
  WAITING_CUSTOMER_APPROVAL = 'WAITING_CUSTOMER_APPROVAL', // Hãng báo giá
  BRAND_REJECTED = 'BRAND_REJECTED', // Hãng từ chối/không tiếp nhận
  CUSTOMER_REJECTED = 'CUSTOMER_REJECTED', //khách hàng từ chối
  BRAND_DONE = 'BRAND_DONE', // Hãng sửa xong
  RETURNED_TO_STORE = 'RETURNED_TO_STORE', // Hàng về lại cửa hàng
  READY_FOR_PICKUP = 'READY_FOR_PICKUP', // Sẵn sàng trả khách
  DELIVERED = 'DELIVERED', // Đã trả cho khách
  FAIL = 'FAIL', // Thất bại/huỷ (case ngoại lệ)
}
