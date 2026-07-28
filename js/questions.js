/**
 * 依恋类型测试 - 24题版题库
 * 焦虑维度(A)12题 + 回避维度(B)12题
 * 每题5个选项，计分1-5
 * 选项顺序：非常同意 → 比较同意 → 中立 → 比较不同意 → 非常不同意
 */

const QUESTIONS = [
  // ===== 焦虑维度（A1-A12）=====
  {
    id: 'A1',
    dimension: 'anxiety',
    text: '我常常担心伴侣会突然对我失去兴趣',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A2',
    dimension: 'anxiety',
    text: '当伴侣几个小时没回消息，我的脑子里会自动编出各种不好的剧本',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A3',
    dimension: 'anxiety',
    text: '我需要频繁地确认对方是真的在乎我的',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A4',
    dimension: 'anxiety',
    text: '有时候我觉得自己喜欢对方比对方喜欢自己多得多，这让我很不安',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A5',
    dimension: 'anxiety',
    text: '在感情里，我很容易觉得自己不够好、不够有吸引力',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A6',
    dimension: 'anxiety',
    text: '单身状态会让我感到非常焦虑，总想赶紧进入下一段关系',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A7',
    dimension: 'anxiety',
    text: '伴侣心情不好时，我第一反应是"是不是我做错了什么"',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A8',
    dimension: 'anxiety',
    text: '看到伴侣和别人聊得开心，我会生出一股说不清的紧张感',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A9',
    dimension: 'anxiety',
    text: '我在关系里会不自觉地讨好对方，害怕冲突会导致分手',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A10',
    dimension: 'anxiety',
    text: '即使关系没什么问题，我也总觉得该担心点什么',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A11',
    dimension: 'anxiety',
    text: '如果伴侣对我说"我们需要谈谈"，我立刻会往最坏的方向想',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'A12',
    dimension: 'anxiety',
    text: '当对方想一个人待着时，我心里会有一个声音说"他/她可能没那么喜欢我了"',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  // ===== 回避维度（B1-B12）=====
  {
    id: 'B1',
    dimension: 'avoidance',
    text: '对方太黏人的时候，我有一种透不过气的感觉',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B2',
    dimension: 'avoidance',
    text: '我在心里藏着一些事，觉得没必要也不愿意跟伴侣分享',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B3',
    dimension: 'avoidance',
    text: '遇到困难时，我的第一反应是自己扛，而不是找伴侣帮忙',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B4',
    dimension: 'avoidance',
    text: '伴侣想跟我认真聊"我们之间怎么了"的时候，我本能地想逃',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B5',
    dimension: 'avoidance',
    text: '我觉得在任何关系中，保持独立是最重要的',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B6',
    dimension: 'avoidance',
    text: '当有人对我表露强烈的依赖和脆弱，我会有些不自在',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B7',
    dimension: 'avoidance',
    text: '我不是那种会跟伴侣聊自己内心感受的人',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B8',
    dimension: 'avoidance',
    text: '一段关系进展得太顺利、太亲密时，我反而觉得不踏实，想抽离一下',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B9',
    dimension: 'avoidance',
    text: '分手后我能很快恢复过来，别人觉得我冷，其实我只是不习惯把情绪摊开',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B10',
    dimension: 'avoidance',
    text: '伴侣在我面前哭，我有时候不知道该做什么，甚至有点尴尬',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B11',
    dimension: 'avoidance',
    text: '我对"完全把自己交给另一个人"这件事有一种本能的抵触',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  },
  {
    id: 'B12',
    dimension: 'avoidance',
    text: '我觉得很多人谈恋爱谈得太累，其实一个人过也挺好的',
    options: [
      { label: '非常同意', score: 5 },
      { label: '比较同意', score: 4 },
      { label: '中立', score: 3 },
      { label: '比较不同意', score: 2 },
      { label: '非常不同意', score: 1 }
    ]
  }
];