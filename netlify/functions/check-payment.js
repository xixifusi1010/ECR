exports.handler = async (event) => {
  // 从查询参数获取UUID
  const uuid = event.queryStringParameters?.uuid || '';

  if (!uuid) {
    return {
      statusCode: 200,
      body: JSON.stringify({ paid: false, error: 'missing uuid' })
    };
  }

  // 从环境变量读取已支付的UUID列表
  const paidList = process.env.PAID_UUIDS || '';
  const uuids = paidList.split(',');

  const paid = uuids.includes(uuid);

  return {
    statusCode: 200,
    body: JSON.stringify({ paid: paid })
  };
};