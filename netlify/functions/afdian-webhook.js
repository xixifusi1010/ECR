const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 200,
      body: JSON.stringify({ ec: 200, em: '' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const order = body.data?.order;

    if (!order) {
      console.log('No order data in webhook body');
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    console.log('Webhook received - plan_id:', order.plan_id, 'status:', order.status);

    if (order.plan_id !== process.env.AFDIAN_PLAN_ID) {
      console.log('Plan ID mismatch. Expected:', process.env.AFDIAN_PLAN_ID, 'Got:', order.plan_id);
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    if (order.status !== 2) {
      console.log('Order not paid. Status:', order.status);
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    const uuid = (order.custom_order_id || '').trim();

    if (!uuid) {
      console.log('No custom_order_id in order');
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: '' })
      };
    }

    console.log('Payment confirmed for UUID:', uuid);

    // 读取当前已支付的UUID列表
    let paidList = process.env.PAID_UUIDS || '';
    let uuids = paidList ? paidList.split(',').filter(Boolean) : [];

    // 避免重复添加
    if (!uuids.includes(uuid)) {
      uuids.push(uuid);
    }

    // 保留最近500个
    if (uuids.length > 500) {
      uuids = uuids.slice(-500);
    }

    const newValue = uuids.join(',');

    // 调用Netlify API更新环境变量
    const token = process.env.NETLIFY_ACCESS_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;

    if (!token || !siteId) {
      console.log('Missing token or siteId');
      return {
        statusCode: 200,
        body: JSON.stringify({ ec: 200, em: 'ok' })
      };
    }

    await updateEnvVar(token, siteId, 'PAID_UUIDS', newValue);
    console.log('PAID_UUIDS updated successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ ec: 200, em: 'ok' })
    };

  } catch (error) {
    console.error('Webhook error:', error.message);
    return {
      statusCode: 200,
      body: JSON.stringify({ ec: 200, em: '' })
    };
  }
};

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
        console.log('Netlify API response status:', res.statusCode);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error('Netlify API returned ' + res.statusCode + ': ' + body));
        }
      });
    });

    req.on('error', (err) => {
      console.error('Netlify API request failed:', err.message);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}