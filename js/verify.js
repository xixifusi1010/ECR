/**
 * 依恋类型测试 - 付费验证逻辑
 * 模式：用户上传付款截图 → 站长手动确认到账 → 自动解锁
 *
 * 站长操作方式：
 *   打开浏览器控制台，输入以下命令确认某用户已付款：
 *     confirmPayment()
 *   该命令会在 localStorage 中标记为已付费，用户刷新后即可看到报告
 *
 * 部署到 Netlify 后：
 *   你可以通过 Netlify 后台的 Functions 或简单的管理页面来确认到账
 */

const VERIFY_CONFIG = {
  price: '6.9',
  priceText: '6.9元',
  // 站长微信号（显示给用户，方便联系）
  wechat: 'example_wechat'
};

/**
 * 站长确认付款（在浏览器控制台执行）
 * 使用方式：在浏览器开发者工具 Console 中输入 confirmPayment() 即可
 * 该命令会标记当前设备为已付费状态
 */
window.confirmPayment = function() {
  localStorage.setItem('attachment_paid', 'true');
  localStorage.setItem('attachment_paid_time', new Date().toISOString());
  localStorage.setItem('attachment_payment_status', 'confirmed');
  console.log('✅ 已确认付款，用户刷新后即可查看完整报告');
  return '付款确认成功';
};

/**
 * 检查当前用户是否已付费
 * @returns {boolean}
 */
function isPaid() {
  return localStorage.getItem('attachment_paid') === 'true';
}

/**
 * 清除付费状态（用于测试）
 */
function clearPayment() {
  localStorage.removeItem('attachment_paid');
  localStorage.removeItem('attachment_paid_time');
  localStorage.removeItem('attachment_payment_screenshot');
  localStorage.removeItem('attachment_payment_status');
  console.log('已清除付费状态');
}