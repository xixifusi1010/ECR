/**
 * 支付系统前端逻辑 - 爱发电自动支付方案
 * 依赖：无
 * 全局暴露：window.Payment
 * 
 * 流程：
 * 1. 用户点击付费 → 新标签页打开爱发电支付页面（携带UUID）
 * 2. 显示等待弹窗，轮询后端检查支付状态
 * 3. 支付成功 → 自动跳转报告页
 * 4. 超时 → 提供手动检查按钮
 */
(function() {
  'use strict';

  var Payment = {
    uuid: '',
    pollingTimer: null,
    maxAttempts: 120, // 最多轮询120次（6分钟）

    // ===== 初始化：生成或读取UUID =====
    init: function() {
      var saved = localStorage.getItem('user_uuid');
      if (!saved) {
        saved = this.generateUUID();
        localStorage.setItem('user_uuid', saved);
      }
      this.uuid = saved;
    },

    // ===== 生成UUID =====
    generateUUID: function() {
      var timestamp = Date.now().toString(36);
      var random = Math.random().toString(36).substring(2, 10);
      return 'UUID_' + timestamp + '_' + random;
    },

    // ===== 开始支付流程 =====
    startPayment: function() {
      // 构建爱发电支付链接，传入UUID作为自定义参数
      var planId = '78d6c5b689d011f19ec75254001e7c00';
      var payUrl = 'https://ifdian.net/item/' + planId + '?custom_order_id=' + this.uuid;

      // 新标签页打开支付页面
      window.open(payUrl, '_blank');

      // 显示等待弹窗
      this.showWaitingModal();

      // 开始轮询检测支付状态
      this.startPolling();
    },

    // ===== 显示等待支付弹窗 =====
    showWaitingModal: function() {
      // 移除旧弹窗（如果存在）
      var oldModal = document.getElementById('payment-waiting-modal');
      if (oldModal) {
        oldModal.remove();
      }

      var html =
        '<div id="payment-waiting-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:1000;display:flex;align-items:center;justify-content:center;">' +
          '<div style="background:white;border-radius:16px;padding:36px 28px;text-align:center;width:90%;max-width:340px;box-shadow:0 10px 40px rgba(0,0,0,0.3);">' +
            '<p style="font-size:18px;font-weight:bold;margin:0 0 8px 0;color:#333;">请在打开的页面完成支付</p>' +
            '<p style="font-size:13px;color:#999;margin:0 0 20px 0;">支付完成后将自动为你解锁完整报告</p>' +
            '<div style="width:36px;height:36px;border:3px solid #f0f0f0;border-top:3px solid #FF6B6B;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>' +
            '<p id="polling-status" style="font-size:12px;color:#bbb;margin:0;">正在等待支付确认...</p>' +
            '<button onclick="Payment.closeModal()" style="margin-top:20px;background:transparent;color:#999;border:1px solid #ddd;padding:8px 24px;border-radius:20px;font-size:13px;cursor:pointer;">取消等待</button>' +
          '</div>' +
        '</div>';

      document.body.insertAdjacentHTML('beforeend', html);
    },

    // ===== 开始轮询 =====
    startPolling: function() {
      var self = this;
      var attempts = 0;

      // 清除之前的轮询
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
      }

      this.pollingTimer = setInterval(function() {
        attempts++;

        // 更新弹窗状态文字
        var statusEl = document.getElementById('polling-status');
        if (statusEl && attempts > 1) {
          statusEl.textContent = '正在等待支付确认... (' + attempts + ')';
        }

        // 调用后端检查支付状态
        fetch('/.netlify/functions/check-payment?uuid=' + self.uuid)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            if (data.paid) {
              // 支付成功
              self.onPaymentSuccess();
            } else if (attempts >= self.maxAttempts) {
              // 超时
              self.onPaymentTimeout();
            }
          })
          .catch(function() {
            // 网络错误，如果超过最大次数则超时
            if (attempts >= self.maxAttempts) {
              self.onPaymentTimeout();
            }
          });
      }, 3000); // 每3秒轮询一次
    },

    // ===== 支付成功处理 =====
    onPaymentSuccess: function() {
      // 停止轮询
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }

      // 保存解锁标记
      localStorage.setItem('report_unlocked', 'true');
      localStorage.setItem('unlock_time', Date.now().toString());

      // 更新弹窗为成功状态
      var modal = document.getElementById('payment-waiting-modal');
      if (modal) {
        modal.querySelector('div').innerHTML =
          '<div style="text-align:center;">' +
            '<p style="font-size:40px;margin:0 0 12px 0;">✅</p>' +
            '<p style="font-size:18px;font-weight:bold;color:#333;margin:0 0 8px 0;">支付成功！</p>' +
            '<p style="font-size:13px;color:#999;margin:0;">正在跳转到完整报告...</p>' +
          '</div>';
      }

      // 1.5秒后跳转
      var self = this;
      setTimeout(function() {
        var modal = document.getElementById('payment-waiting-modal');
        if (modal) {
          modal.remove();
        }
        window.location.href = 'report.html';
      }, 1500);
    },

    // ===== 支付超时处理 =====
    onPaymentTimeout: function() {
      // 停止轮询
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }

      // 更新弹窗为超时状态
      var modal = document.getElementById('payment-waiting-modal');
      if (modal) {
        modal.querySelector('div').innerHTML =
          '<div style="text-align:center;">' +
            '<p style="font-size:16px;color:#333;margin:0 0 8px 0;">检测超时</p>' +
            '<p style="font-size:13px;color:#666;margin:0 0 16px 0;">如果您已完成支付，请关闭此弹窗后点击"已完成支付，点击解锁"按钮</p>' +
            '<button onclick="document.getElementById(\'payment-waiting-modal\').remove();Payment.pollingTimer=null;" style="background:#FF6B6B;color:white;border:none;padding:10px 28px;border-radius:20px;font-size:14px;cursor:pointer;">我知道了</button>' +
          '</div>';
      }
    },

    // ===== 手动检查（用户在超时后点击按钮触发） =====
    manualCheck: function() {
      var self = this;

      // 显示加载提示
      var btn = document.getElementById('manual-check-btn');
      if (btn) {
        btn.textContent = '正在检查...';
        btn.disabled = true;
      }

      fetch('/.netlify/functions/check-payment?uuid=' + self.uuid)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.paid) {
            self.onPaymentSuccess();
          } else {
            alert('暂未检测到您的支付记录。请确认：\n1. 是否已完成支付\n2. 支付是否成功\n\n如支付遇到问题，请联系客服。');
            if (btn) {
              btn.textContent = '已完成支付，点击解锁';
              btn.disabled = false;
            }
          }
        })
        .catch(function() {
          alert('网络错误，请稍后重试');
          if (btn) {
            btn.textContent = '已完成支付，点击解锁';
            btn.disabled = false;
          }
        });
    },

    // ===== 关闭弹窗（不清除轮询） =====
    closeModal: function() {
      var modal = document.getElementById('payment-waiting-modal');
      if (modal) {
        modal.remove();
      }
      // 不停止轮询，用户回来后如果支付成功会自动跳转
    },

    // ===== 检查是否已解锁 =====
    isUnlocked: function() {
      var unlocked = localStorage.getItem('report_unlocked');
      var unlockTime = localStorage.getItem('unlock_time');

      if (unlocked === 'true' && unlockTime) {
        var elapsed = Date.now() - parseInt(unlockTime, 10);
        // 24小时内有效
        if (elapsed < 24 * 60 * 60 * 1000) {
          return true;
        } else {
          // 超过24小时，清除解锁标记
          localStorage.removeItem('report_unlocked');
          localStorage.removeItem('unlock_time');
        }
      }

      return false;
    }
  };

  // 页面加载时初始化
  Payment.init();

  // 暴露全局
  window.Payment = Payment;

})();