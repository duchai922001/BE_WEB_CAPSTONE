import { PaymentMethod } from 'src/common/enums/payment';

const paymentMethodMap: Record<PaymentMethod, string> = {
  [PaymentMethod.COD]: 'Thanh toán khi nhận hàng',
  [PaymentMethod.PAY_IN_STORE]: 'Thanh toán tại cửa hàng',
  [PaymentMethod.ZALO_PAY]: 'Thanh toán online qua ZaloPay',
  [PaymentMethod.MOMO]: 'Thanh toán online qua MoMo',
  [PaymentMethod.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
  [PaymentMethod.CREDIT_CARD]: 'Thẻ tín dụng / ghi nợ',
};

function applyDiscount(
  price: number,
  promo?: { discountType: string; discountValue: number },
  defaultPromo?: { discountType: string; discountValue: number },
) {
  let discount = 0;
  const appliedPromo = promo || defaultPromo;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'PERCENT') {
      discount = (price * appliedPromo.discountValue) / 100;
    } else if (appliedPromo.discountType === 'AMOUNT') {
      discount = appliedPromo.discountValue;
    }
  }
  return { discount, finalPrice: Math.max(price - discount, 0) };
}

export const generateInvoiceHTML = (
  order: any,
  cashierName: string = 'Thu ngân',
  promoMap: Record<string, any> = {},
  defaultPromo: any = null,
) => {
  let total = 0;

  const itemsHtml = (order.orderItems || [])
    .map((item: any, index: number) => {
      const product = item.product || {};
      const variable = item.variable || null;
      const quantity = item.quantity || 1;

      const unitPrice = variable?.sellPrice || product.sellPrice || 0;
      const { discount, finalPrice } = applyDiscount(
        unitPrice,
        promoMap[product._id?.toString()],
        defaultPromo,
      );

      total += finalPrice * quantity;

      const productName =
        variable?.name || product.name || `Sản phẩm ${index + 1}`;
      const productImage = item.imageUrl
        ? `<img src="${item.imageUrl}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;" />`
        : '';

      return `
      <tr>
        <td style="display:flex; align-items:center; gap:8px;">
          ${productImage} ${productName}
        </td>
        <td>${quantity}</td>
        <td>${unitPrice.toLocaleString('vi-VN')}₫</td>
        <td>${discount > 0 ? `-${discount.toLocaleString('vi-VN')}₫` : '0₫'}</td>
        <td>${(finalPrice * quantity).toLocaleString('vi-VN')}₫</td>
      </tr>`;
    })
    .join('');

  const paymentMethodDisplay =
    paymentMethodMap[order?.order?.paymentMethod] || 'Chưa xác định';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 20px; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .logo img { width: 120px; }
  .store-info { text-align: right; font-size: 12px; line-height: 1.4; }
  h2 { margin: 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: middle; }
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

  <h2 style="text-align:center;">HÓA ĐƠN THANH TOÁN</h2>

  <p><b>Mã đơn:</b> ${order?.order?.orderCode}</p>
  <p><b>Ngày:</b> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
  <p><b>Hình thức thanh toán:</b> ${paymentMethodDisplay}</p>

  <table>
    <thead>
      <tr>
        <th>Sản phẩm</th>
        <th>Số lượng</th>
        <th>Đơn giá</th>
        <th>Giảm giá</th>
        <th>Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4">Tổng tiền</td>
        <td>${total.toLocaleString('vi-VN')}₫</td>
      </tr>
      <tr>
        <td colspan="4">Khách cần thanh toán</td>
        <td>${order.customerPaid?.toLocaleString('vi-VN') || total.toLocaleString('vi-VN')}₫</td>
      </tr>
    </tfoot>
  </table>

  <div class="signatures">
    <div class="sign">
      Khách hàng<br><br>
      (Ký và ghi rõ họ tên)
    </div>
    <div class="sign">
      Thu ngân<br><br>
      <strong>${cashierName}</strong>
    </div>
  </div>

  <div class="footer">
    Bluetooth Mobile - Cảm ơn bạn đã quan tâm cửa hàng!
  </div>

</body>
</html>`;
};
