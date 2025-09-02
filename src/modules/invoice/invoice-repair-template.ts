export function generateInvoiceRepairHTML(
  repairRequest: any,
  invoiceItems: any[],
  cashierName: string,
): string {
  const itemsHtml = invoiceItems
    .map(
      (item, index) => `
        <tr>
          <td style="text-align:center;">
            ${new Date(repairRequest.createdAt).toLocaleDateString('vi-VN')}
          </td>
          <td style="text-align:center;">
            ${repairRequest.repairType || 'Sửa chữa'}
          </td>
          <td>${item.description || 'Dịch vụ / Linh kiện'}</td>
          <td style="text-align:right;">
            ${item.laborCost?.toLocaleString('vi-VN') || 0}₫
          </td>
          <td style="text-align:right;">
            ${(item.totalPrice || 0).toLocaleString('vi-VN')}₫
          </td>
        </tr>
      `,
    )
    .join('');

  const total = invoiceItems.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0,
  );

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .logo img { width: 120px; }
  .store-info { text-align: right; font-size: 12px; line-height: 1.4; }
  h2 { margin: 0; text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border: 1px solid #ccc; padding: 8px; vertical-align: middle; }
  th { background-color: #f5f5f5; }
  tfoot td { font-weight: bold; }
  .footer { margin-top: 40px; text-align: center; font-size: 14px; }
  .signatures { display: flex; justify-content: space-between; margin-top: 50px; font-size: 12px; }
  .sign { text-align: center; }
</style>
</head>
<body>

  <div class="header">
    <div class="logo" style="background-color:#007bff; padding:10px; border-radius:8px;">
      <img src="https://res.cloudinary.com/dltpndswd/image/upload/v1755681903/bluetooth_uploads/zm1o1av0h4hsmskho8yf.png" />
    </div>
    <div class="store-info">
      <strong>Bluetooth Mobile</strong><br>
      Địa chỉ: 263 Đặng Văn Bi, Trường Thọ, Thủ Đức<br>
      Hotline: 0708 592 979<br>
      Email: support@bluetoothmobile.vn
    </div>
  </div>

  <h2>HÓA ĐƠN SỬA CHỮA</h2>

  <p><b>Mã yêu cầu:</b> ${repairRequest.repairRequestCode}</p>
  <p><b>Khách hàng:</b> ${repairRequest.customerName || 'N/A'}</p>
  <p><b>Số điện thoại:</b> ${repairRequest.customerPhone || ''}</p>

  <table>
    <thead>
      <tr>
        <th>Ngày tạo</th>
        <th>Loại sửa chữa</th>
        <th>Tên dịch vụ / Mô tả</th>
        <th>Phí công</th>
        <th>Tổng tiền</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4">Tổng cộng</td>
        <td style="text-align:right;">${total.toLocaleString('vi-VN')}₫</td>
      </tr>
    </tfoot>
  </table>

  <div class="signatures">
    <div class="sign">
      Khách hàng<br><br>
      (Ký và ghi rõ họ tên)
    </div>
    <div class="sign">
      Kỹ thuật viên<br><br>
      <strong>${cashierName}</strong>
    </div>
  </div>

  <div class="footer">
    Bluetooth Mobile - Cảm ơn bạn đã tin tưởng dịch vụ sửa chữa!
  </div>

</body>
</html>`;
}
