/**
 * 依恋类型测试 - 计分与类型判定逻辑（24题版）
 * 焦虑维度：A1-A12，回避维度：B1-B12
 * 阈值：中位数36分
 * 子维度：每个维度3个子维度，各4题
 */

const ATTACHMENT_TYPES = {
  SECURE: {
    key: 'secure',
    name: '安全型',
    nameEn: 'Secure Attachment',
    tagline: '你在关系中能够保持亲密与独立的平衡，既能享受依赖，也能给予空间。',
    color: '#4CAF50'
  },
  ANXIOUS: {
    key: 'anxious',
    name: '焦虑型',
    nameEn: 'Anxious Attachment',
    tagline: '你在关系中渴望极致的亲密与确认，害怕被忽视，需要持续的安全感。',
    color: '#FF9800'
  },
  AVOIDANT: {
    key: 'avoidant',
    name: '回避型',
    nameEn: 'Avoidant Attachment',
    tagline: '你在关系中渴望亲密，但对方太靠近时又本能地后退，这种拉扯感让你和伴侣都感到疲惫。',
    color: '#2196F3'
  },
  DISORGANIZED: {
    key: 'disorganized',
    name: '混乱型',
    nameEn: 'Disorganized Attachment',
    tagline: '你在关系中既渴望亲密又恐惧受伤，内心充满矛盾，常常感到无所适从。',
    color: '#9C27B0'
  }
};

const THRESHOLD = 36; // 24题版中位数阈值

/**
 * 计算焦虑和回避维度得分
 * @param {Object} answers - 用户答案 { questionId: score }
 * @returns {{ anxiety: number, avoidance: number }}
 */
function calculateScores(answers) {
  let anxiety = 0;
  let avoidance = 0;

  for (const [id, score] of Object.entries(answers)) {
    if (id.startsWith('A')) {
      anxiety += score;
    } else if (id.startsWith('B')) {
      avoidance += score;
    }
  }

  return { anxiety, avoidance };
}

/**
 * 计算子维度得分
 * 焦虑子维度：
 *   - 对抛弃的恐惧: A1, A4, A7, A11
 *   - 过度警觉与信号放大: A2, A8, A10, A12
 *   - 自我评价与讨好倾向: A3, A5, A6, A9
 * 回避子维度：
 *   - 亲密距离敏感: B1, B4, B8, B11
 *   - 情感表达抑制: B2, B7, B10, B12
 *   - 独立执念与依赖回避: B3, B5, B6, B9
 */
function calculateSubScores(answers) {
  const anxSubs = {
    fear: 0,          // 对抛弃的恐惧
    hypervigilance: 0, // 过度警觉与信号放大
    lowSelfWorth: 0    // 自我评价与讨好倾向
  };
  const avoSubs = {
    distance: 0,       // 亲密距离敏感
    expression: 0,     // 情感表达抑制
    independence: 0    // 独立执念与依赖回避
  };

  // 焦虑子维度映射
  const anxFearIds = ['A1', 'A4', 'A7', 'A11'];
  const anxHyperIds = ['A2', 'A8', 'A10', 'A12'];
  const anxWorthIds = ['A3', 'A5', 'A6', 'A9'];

  // 回避子维度映射
  const avoDistIds = ['B1', 'B4', 'B8', 'B11'];
  const avoExprIds = ['B2', 'B7', 'B10', 'B12'];
  const avoIndepIds = ['B3', 'B5', 'B6', 'B9'];

  for (const [id, score] of Object.entries(answers)) {
    if (anxFearIds.includes(id)) anxSubs.fear += score;
    else if (anxHyperIds.includes(id)) anxSubs.hypervigilance += score;
    else if (anxWorthIds.includes(id)) anxSubs.lowSelfWorth += score;
    else if (avoDistIds.includes(id)) avoSubs.distance += score;
    else if (avoExprIds.includes(id)) avoSubs.expression += score;
    else if (avoIndepIds.includes(id)) avoSubs.independence += score;
  }

  return { anxSubs, avoSubs };
}

/**
 * 获取子维度等级
 * 4-9分：低，10-15分：中，16-20分：高
 */
function getSubLevel(score) {
  if (score <= 9) return 'low';
  if (score <= 15) return 'mid';
  return 'high';
}

/**
 * 根据得分判定依恋类型
 * @param {number} anxiety - 焦虑维度总分
 * @param {number} avoidance - 回避维度总分
 * @returns {{ type: Object, scores: { anxiety: number, avoidance: number } }}
 */
function determineType(anxiety, avoidance) {
  const isHighAnxiety = anxiety >= THRESHOLD;
  const isHighAvoidance = avoidance >= THRESHOLD;

  let typeKey;
  if (!isHighAnxiety && !isHighAvoidance) {
    typeKey = 'secure';
  } else if (isHighAnxiety && !isHighAvoidance) {
    typeKey = 'anxious';
  } else if (!isHighAnxiety && isHighAvoidance) {
    typeKey = 'avoidant';
  } else {
    typeKey = 'disorganized';
  }

  return {
    type: ATTACHMENT_TYPES[typeKey.toUpperCase()],
    scores: { anxiety, avoidance }
  };
}

/**
 * 获取得分等级
 * 12-27：低，28-44：中，45-60：高
 */
function getScoreLevel(score) {
  if (score <= 27) return 'low';
  if (score <= 44) return 'mid';
  return 'high';
}

/**
 * 完整计分流程
 * @param {Object} answers - 用户答案
 * @returns {Object} 包含类型信息、得分和子维度得分
 */
function getAttachmentResult(answers) {
  const scores = calculateScores(answers);
  const subScores = calculateSubScores(answers);
  const typeResult = determineType(scores.anxiety, scores.avoidance);

  return {
    ...typeResult,
    subScores,
    anxietyLevel: getScoreLevel(scores.anxiety),
    avoidanceLevel: getScoreLevel(scores.avoidance),
    anxSubLevels: {
      fear: getSubLevel(subScores.anxSubs.fear),
      hypervigilance: getSubLevel(subScores.anxSubs.hypervigilance),
      lowSelfWorth: getSubLevel(subScores.anxSubs.lowSelfWorth)
    },
    avoSubLevels: {
      distance: getSubLevel(subScores.avoSubs.distance),
      expression: getSubLevel(subScores.avoSubs.expression),
      independence: getSubLevel(subScores.avoSubs.independence)
    }
  };
}