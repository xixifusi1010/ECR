const https = require('https');

exports.handler = async (event) => {
  // 只接受POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 200,
      body: JSON.stringify({ ec: 200, em: '' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const order = body.data?.order;

    // 验证：必须有订单数据
    if (!order) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    // 验证：必须是我们的商品
    if (order.plan_id !== process.env.AFDIAN_PLAN_ID) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    // 验证：必须支付成功（status=2）
    if (order.status !== 2) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    // 关键：提取custom_order_id（即用户UUID）
    const uuid = (order.custom_order_id || '').trim();

    if (!uuid) {
      console.log('Webhook received but no custom_order_id');
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    console.log('Payment confirmed for UUID:', uuid);

    // 读取当前已支付的UUID列表
    let paidList = process.env.PAID_UUIDS || '';
    let uuids = paidList ? paidList.split(',') : [];

    // 避免重复添加
    if (!uuids.includes(uuid)) {
      uuids.push(uuid);
    }

    // 保留最近200个，防止环境变量过大
    if (uuids.length > 200) {
      uuids = uuids.slice(-200);
    }

    // 调用Netlify API更新环境变量
    const token = process.env.NETLIFY_ACCESS_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;

    if (token && siteId) {
      await updateEnvVar(token, siteId, 'PAID_UUIDS', uuids.join(','));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ec: 200, em: 'ok' })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({ ec: 200, em: '' })
    };
  }
};

// 调用Netlify API更新环境变量
function updateEnvVar(token, siteId, key, value) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ key: key, value: value });

    const options = {
      hostname: 'api.netlify.com',
      path: '/api/v1/sites/' + siteId + '/env/' + key,
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('Failed to update env var:', err.message);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}