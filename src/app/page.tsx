'use client'

// Minimalist Modern Design System - Idle Cultivation Game

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Swords,
  Shield,
  Heart,
  Zap,
  Sparkles,
  Settings,
  Play,
  Pause,
  Scroll,
  Gift,
  Compass,
  Flame,
  Snowflake,
  Cat,
  Gem,
  Gavel,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  Package,
  X,
  Plus,
  Coins
} from 'lucide-react'

// 游戏数据类型定义
type Profession = 'sword' | 'body' | 'fire' | 'ice' | 'thunder' | 'beast'
type Talent = 'normal' | 'huanggu' | 'xianti'
type Quality = 'white' | 'green' | 'blue' | 'purple' | 'orange' | 'red'
type QuestStatus = 'in_progress' | 'completed' | 'claimed'
type EquipmentType = 'weapon' | 'armor' | 'accessory'

interface Equipment {
  id: number
  name: string
  type: EquipmentType
  level: number
  quality: Quality
  price: number
  attributes: {
    attack?: number
    defense?: number
    hp?: number
    crit?: number
  }
}

interface Player {
  name: string
  profession: Profession
  talent: Talent
  level: number
  realm: string
  exp: number
  age: number
  lifespan: number
  sect: string
  pet: string
  attributes: {
    attack: number
    defense: number
    hp: number
    maxHp: number
    crit: number
  }
}

interface Monster {
  id: number
  name: string
  level: number
  hp: number
  attack: number
  defense: number
  exp: number
  gold: number
  dropRate: {
    spiritStone: number
    pill: number
    equipment: number
  }
}

interface Quest {
  id: number
  name: string
  description: string
  type: 'monster_kill' | 'resource_collect' | 'realm_reach' | 'equipment_wear'
  target: string
  progress: number
  goal: number
  status: QuestStatus
  rewards: {
    exp: number
    gold: number
  }
}

interface Adventure {
  id: number
  title: string
  description: string
  content: string
  options: Array<{
    id: number
    text: string
    result: {
      success: boolean
      message: string
      rewards?: {
        exp?: number
        gold?: number
        spiritStone?: number
        pills?: number
        pet?: string
        sect?: string
        lifespan?: number
        equipment?: Equipment
        attributes?: {
          attack?: number
          defense?: number
          hp?: number
          crit?: number
        }
      }
    }
  }>
}

interface SectCultivation {
  sect: string
  name: string
  description: string
  cost: {
    gold: number
    spiritStone: number
  }
  rewards: {
    exp: number
    attributes?: {
      attack?: number
      defense?: number
      hp?: number
      crit?: number
    }
  }
  cooldown: number
}

// 常量数据
const PROFESSIONS = {
  sword: { name: '剑修', icon: Swords, desc: '擅长御剑飞行，攻击力高，速度快' },
  body: { name: '体修', icon: Shield, desc: '体魄强健，防御力高，生命值高' },
  fire: { name: '灵焰师', icon: Flame, desc: '掌控火焰，群体攻击，暴击率高' },
  ice: { name: '冰灵师', icon: Snowflake, desc: '掌控冰霜，减速控制，持续伤害' },
  thunder: { name: '雷灵师', icon: Zap, desc: '掌控雷电，高爆发，命中率高' },
  beast: { name: '御兽师', icon: Cat, desc: '驾驭灵兽，辅助增益，多面手' }
}

const TALENTS = {
  normal: { name: '普通体质', bonus: 1 },
  huanggu: { name: '荒古圣体', bonus: 1.5 },
  xianti: { name: '先天圣体道胎', bonus: 2 }
}

const REALMS = ['淬体', '炼气', '筑基', '金丹', '元婴', '化神', '大乘', '渡劫', '飞升']

const QUALITY_COLORS: Record<Quality, string> = {
  white: 'text-gray-500',
  green: 'text-green-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
  red: 'text-red-500'
}

const EQUIPMENT_SHOP: Equipment[] = [
  // 武器
  { id: 1, name: '木剑', type: 'weapon', level: 1, quality: 'white', price: 50, attributes: { attack: 5 } },
  { id: 2, name: '铁剑', type: 'weapon', level: 2, quality: 'green', price: 200, attributes: { attack: 12 } },
  { id: 3, name: '精钢剑', type: 'weapon', level: 3, quality: 'blue', price: 500, attributes: { attack: 25, crit: 0.05 } },
  { id: 4, name: '灵剑', type: 'weapon', level: 4, quality: 'purple', price: 1200, attributes: { attack: 45, crit: 0.08 } },
  { id: 5, name: '法宝剑', type: 'weapon', level: 5, quality: 'orange', price: 3000, attributes: { attack: 80, crit: 0.12 } },
  { id: 6, name: '仙品神剑', type: 'weapon', level: 6, quality: 'red', price: 8000, attributes: { attack: 150, crit: 0.18 } },
  
  // 防具
  { id: 11, name: '布衣', type: 'armor', level: 1, quality: 'white', price: 50, attributes: { defense: 3, hp: 20 } },
  { id: 12, name: '铁甲', type: 'armor', level: 2, quality: 'green', price: 200, attributes: { defense: 8, hp: 50 } },
  { id: 13, name: '精钢甲', type: 'armor', level: 3, quality: 'blue', price: 500, attributes: { defense: 18, hp: 100 } },
  { id: 14, name: '灵甲', type: 'armor', level: 4, quality: 'purple', price: 1200, attributes: { defense: 35, hp: 200 } },
  { id: 15, name: '法宝甲', type: 'armor', level: 5, quality: 'orange', price: 3000, attributes: { defense: 65, hp: 400 } },
  { id: 16, name: '仙品神甲', type: 'armor', level: 6, quality: 'red', price: 8000, attributes: { defense: 120, hp: 800 } },
  
  // 饰品
  { id: 21, name: '玉佩', type: 'accessory', level: 1, quality: 'white', price: 50, attributes: { hp: 30 } },
  { id: 22, name: '灵玉', type: 'accessory', level: 2, quality: 'green', price: 200, attributes: { hp: 80, crit: 0.03 } },
  { id: 23, name: '宝玉', type: 'accessory', level: 3, quality: 'blue', price: 500, attributes: { hp: 150, crit: 0.05, attack: 5 } },
  { id: 24, name: '灵宝', type: 'accessory', level: 4, quality: 'purple', price: 1200, attributes: { hp: 300, crit: 0.08, attack: 15 } },
  { id: 25, name: '法宝', type: 'accessory', level: 5, quality: 'orange', price: 3000, attributes: { hp: 600, crit: 0.12, attack: 30 } },
  { id: 26, name: '仙品宝物', type: 'accessory', level: 6, quality: 'red', price: 8000, attributes: { hp: 1200, crit: 0.18, attack: 60 } }
]

const MONSTERS: Monster[] = [
  { id: 1, name: '山妖', level: 1, hp: 50, attack: 5, defense: 2, exp: 10, gold: 5, dropRate: { spiritStone: 0.2, pill: 0.1, equipment: 0.05 } },
  { id: 2, name: '野狼', level: 3, hp: 80, attack: 8, defense: 3, exp: 20, gold: 10, dropRate: { spiritStone: 0.25, pill: 0.15, equipment: 0.06 } },
  { id: 3, name: '狐妖', level: 5, hp: 120, attack: 12, defense: 5, exp: 35, gold: 18, dropRate: { spiritStone: 0.3, pill: 0.2, equipment: 0.07 } },
  { id: 4, name: '猛虎', level: 8, hp: 180, attack: 18, defense: 8, exp: 60, gold: 30, dropRate: { spiritStone: 0.35, pill: 0.25, equipment: 0.08 } },
  { id: 5, name: '妖狼王', level: 10, hp: 250, attack: 25, defense: 12, exp: 100, gold: 50, dropRate: { spiritStone: 0.4, pill: 0.3, equipment: 0.09 } },
  { id: 6, name: '蛇妖', level: 15, hp: 350, attack: 35, defense: 18, exp: 150, gold: 80, dropRate: { spiritStone: 0.45, pill: 0.35, equipment: 0.1 } },
  { id: 7, name: '赤炎兽', level: 20, hp: 500, attack: 50, defense: 25, exp: 250, gold: 120, dropRate: { spiritStone: 0.5, pill: 0.4, equipment: 0.11 } },
  { id: 8, name: '玄冰兽', level: 25, hp: 700, attack: 70, defense: 35, exp: 400, gold: 180, dropRate: { spiritStone: 0.55, pill: 0.45, equipment: 0.12 } },
  { id: 9, name: '雷兽', level: 30, hp: 1000, attack: 100, defense: 50, exp: 600, gold: 250, dropRate: { spiritStone: 0.6, pill: 0.5, equipment: 0.13 } },
  { id: 10, name: '魔王', level: 35, hp: 1500, attack: 150, defense: 75, exp: 1000, gold: 400, dropRate: { spiritStone: 0.7, pill: 0.6, equipment: 0.15 } }
]

const ADVENTURES: Adventure[] = [
  {
    id: 1,
    title: '神秘洞府',
    description: '你发现了一处古老的洞府',
    content: '洞府入口布满青苔，依稀可见"仙人居"三个大字。洞中可能藏有珍贵宝藏，也可能有凶险机关。',
    options: [
      {
        id: 1,
        text: '小心探索',
        result: {
          success: true,
          message: '你谨慎地探索了洞府，发现了一些丹药和灵石！',
          rewards: { exp: 50, gold: 100, spiritStone: 5, pills: 2 }
        }
      },
      {
        id: 2,
        text: '无视离去',
        result: {
          success: false,
          message: '你离开了洞府，错过了其中的宝藏。'
        }
      }
    ]
  },
  {
    id: 2,
    title: '受伤修士',
    description: '路遇一位受伤的修士',
    content: '这位修士面色苍白，衣衫褴褛，显然受了重伤。他似乎有重要的事情要告诉你。',
    options: [
      {
        id: 1,
        text: '出手相助',
        result: {
          success: true,
          message: '你救下了这位修士，他感激地传授了你一些修炼心得！',
          rewards: { exp: 100, attributes: { attack: 5, defense: 3 } }
        }
      },
      {
        id: 2,
        text: '无视离去',
        result: {
          success: false,
          message: '你没有理会这位修士，继续你的旅程。'
        }
      }
    ]
  },
  {
    id: 3,
    title: '灵兽幼崽',
    description: '发现一只受伤的灵兽幼崽',
    content: '一只小灵兽蜷缩在路边，似乎受了伤。它看起来很可爱，眼神中充满了求救的渴望。',
    options: [
      {
        id: 1,
        text: '救治灵兽',
        result: {
          success: true,
          message: '你救治了这只灵兽，它决定跟随你踏上修仙之路！',
          rewards: { pet: '灵狐', exp: 80 }
        }
      },
      {
        id: 2,
        text: '无视离去',
        result: {
          success: false,
          message: '你没有理会这只灵兽，继续前行。'
        }
      }
    ]
  },
  {
    id: 4,
    title: '门派招新',
    description: '某门派正在招收弟子',
    content: '一群修士正在招揽新人，他们穿着统一服饰，似乎来自一个颇有实力的门派。',
    options: [
      {
        id: 1,
        text: '加入门派',
        result: {
          success: true,
          message: '你成功加入了这个门派，获得了门派的庇护和资源！',
          rewards: { sect: '青云门', exp: 150, gold: 200 }
        }
      },
      {
        id: 2,
        text: '保持独立',
        result: {
          success: false,
          message: '你决定保持独立修炼，继续你的散修之路。'
        }
      }
    ]
  },
  {
    id: 5,
    title: '天降灵雨',
    description: '天降灵雨，机缘已到',
    content: '天空中忽然下起了一场灵雨，每一滴雨珠都蕴含着充沛的灵气。这是一个难得的修炼机会！',
    options: [
      {
        id: 1,
        text: '借机修炼',
        result: {
          success: true,
          message: '你在灵雨中修炼，修为大幅提升！',
          rewards: { exp: 200, pills: 5 }
        }
      },
      {
        id: 2,
        text: '收集灵雨',
        result: {
          success: true,
          message: '你用容器收集了灵雨，获得了珍贵的丹药！',
          rewards: { pills: 10, spiritStone: 10 }
        }
      }
    ]
  },
  {
    id: 6,
    title: '古墓探险',
    description: '发现一座古老墓穴',
    content: '墓穴前立着一块石碑，上书"生死有命，富贵在天"八个大字。墓穴深处似乎有宝光闪烁，但也可能隐藏着危险的机关和僵尸。',
    options: [
      {
        id: 1,
        text: '深入探索',
        result: {
          success: true,
          message: '你成功避开了机关，在墓室中找到了一件法宝！',
          rewards: { exp: 120, equipment: EQUIPMENT_SHOP[3], spiritStone: 8 }
        }
      },
      {
        id: 2,
        text: '谨慎撤退',
        result: {
          success: false,
          message: '你决定不冒险，安全地离开了墓穴。'
        }
      }
    ]
  },
  {
    id: 7,
    title: '秘境开启',
    description: '传说中的秘境开启了',
    content: '一道灵光冲天而起，传说中的上古秘境突然开启。进入秘境可能获得珍贵宝物，但也充满凶险。',
    options: [
      {
        id: 1,
        text: '进入秘境',
        result: {
          success: true,
          message: '你在秘境中历经艰险，最终获得了丰厚的回报！',
          rewards: { exp: 300, gold: 500, pills: 8, spiritStone: 15 }
        }
      },
      {
        id: 2,
        text: '观望等待',
        result: {
          success: false,
          message: '你决定等待时机，秘境很快就关闭了。',
          rewards: { exp: 30 }
        }
      }
    ]
  },
  {
    id: 8,
    title: '炼器大师',
    description: '遇到了一位炼器大师',
    content: '一位白发苍苍的老者正在路边摆摊，摊位上摆满了各式法宝。他似乎很想找一个传人。',
    options: [
      {
        id: 1,
        text: '拜师学艺',
        result: {
          success: true,
          message: '大师看你悟性不错，赠予你一件精品法器！',
          rewards: { exp: 150, equipment: EQUIPMENT_SHOP[8] }
        }
      },
      {
        id: 2,
        text: '购买法宝',
        result: {
          success: true,
          message: '你花费了一些金币，购买了一件不错的武器。',
          rewards: { equipment: EQUIPMENT_SHOP[2] }
        }
      }
    ]
  },
  {
    id: 9,
    title: '魔修袭击',
    description: '突然遭到魔修伏击',
    content: '几个魔修突然从暗处跳出，企图抢夺你的资源。你必须做出选择！',
    options: [
      {
        id: 1,
        text: '奋力反击',
        result: {
          success: true,
          message: '你击退了魔修，从他们身上搜刮到了一些财物！',
          rewards: { exp: 100, gold: 300, equipment: EQUIPMENT_SHOP[11] }
        }
      },
      {
        id: 2,
        text: '交出财物',
        result: {
          success: false,
          message: '你交出了一些金币保命，魔修扬长而去。'
        }
      }
    ]
  },
  {
    id: 10,
    title: '仙药出世',
    description: '千年仙药即将成熟',
    content: '山谷中一株千年仙药散发出诱人的香气，许多修士都在争夺。你也想分一杯羹。',
    options: [
      {
        id: 1,
        text: '参与争夺',
        result: {
          success: true,
          message: '经过一番激战，你成功夺得仙药！实力大增！',
          rewards: { exp: 250, pills: 15, attributes: { attack: 10, defense: 8, hp: 100 } }
        }
      },
      {
        id: 2,
        text: '暗中观察',
        result: {
          success: true,
          message: '你在混战中偷偷捡了一些掉落的药材。',
          rewards: { pills: 5, spiritStone: 5 }
        }
      }
    ]
  },
  {
    id: 11,
    title: '前辈传承',
    description: '发现前辈遗留的传承',
    content: '一道神识印记突然出现在你脑海中，这是某位前辈留下的传承。接受传承可能有风险，但收益巨大。',
    options: [
      {
        id: 1,
        text: '接受传承',
        result: {
          success: true,
          message: '你成功接受了传承，修为突飞猛进，还获得了一件神器！',
          rewards: { exp: 400, equipment: EQUIPMENT_SHOP[14], attributes: { attack: 15, defense: 12, crit: 0.05 } }
        }
      },
      {
        id: 2,
        text: '拒绝传承',
        result: {
          success: false,
          message: '你担心有诈，拒绝了这份传承。'
        }
      }
    ]
  },
  {
    id: 12,
    title: '神秘商人',
    description: '遇到了神秘的行商',
    content: '一个蒙面商人向你兜售各种珍稀物品，价格不菲但确实罕见。',
    options: [
      {
        id: 1,
        text: '购买宝物',
        result: {
          success: true,
          message: '你购买了商人的宝物，获得了一件稀有装备！',
          rewards: { equipment: EQUIPMENT_SHOP[23] }
        }
      },
      {
        id: 2,
        text: '讨价还价',
        result: {
          success: true,
          message: '经过一番讨价还价，商人给你打了折扣！',
          rewards: { gold: 100, spiritStone: 10 }
        }
      }
    ]
  }
]

const SECT_CULTIVATIONS: SectCultivation[] = [
  {
    sect: '青云门',
    name: '青云剑诀',
    description: '青云门秘传剑法，修炼可提升攻击力和暴击率',
    cost: { gold: 100, spiritStone: 5 },
    rewards: { exp: 80, attributes: { attack: 8, crit: 0.02 } },
    cooldown: 3600
  },
  {
    sect: '青云门',
    name: '护体真气',
    description: '青云门基础防御功法，修炼可提升防御力和生命值',
    cost: { gold: 80, spiritStone: 4 },
    rewards: { exp: 60, attributes: { defense: 6, hp: 80 } },
    cooldown: 3600
  },
  {
    sect: '天音寺',
    name: '大悲咒',
    description: '天音寺佛门心法，修炼可大幅提升生命值',
    cost: { gold: 120, spiritStone: 6 },
    rewards: { exp: 100, attributes: { hp: 150, defense: 10 } },
    cooldown: 3600
  },
  {
    sect: '天音寺',
    name: '金刚不坏',
    description: '天音寺至高防御神功',
    cost: { gold: 150, spiritStone: 8 },
    rewards: { exp: 120, attributes: { defense: 15, hp: 100 } },
    cooldown: 3600
  },
  {
    sect: '鬼王宗',
    name: '血炼大法',
    description: '鬼王宗邪道功法，可大幅提升攻击但略减生命',
    cost: { gold: 150, spiritStone: 8 },
    rewards: { exp: 150, attributes: { attack: 20, crit: 0.05 } },
    cooldown: 3600
  },
  {
    sect: '鬼王宗',
    name: '魔功噬魂',
    description: '鬼王宗禁术，修炼可获得强大暴击能力',
    cost: { gold: 180, spiritStone: 10 },
    rewards: { exp: 180, attributes: { attack: 15, crit: 0.08 } },
    cooldown: 3600
  },
  {
    sect: '烈火殿',
    name: '烈焰心法',
    description: '烈火殿核心功法，提升火属性攻击力',
    cost: { gold: 130, spiritStone: 7 },
    rewards: { exp: 110, attributes: { attack: 12, crit: 0.03 } },
    cooldown: 3600
  },
  {
    sect: '玄冰谷',
    name: '寒冰真诀',
    description: '玄冰谷秘传功法，提升冰属性防御',
    cost: { gold: 130, spiritStone: 7 },
    rewards: { exp: 110, attributes: { defense: 12, hp: 100 } },
    cooldown: 3600
  }
]

const INITIAL_QUESTS: Quest[] = [
  {
    id: 1,
    name: '初试锋芒',
    description: '击败3只山妖',
    type: 'monster_kill',
    target: '山妖',
    progress: 0,
    goal: 3,
    status: 'in_progress',
    rewards: { exp: 50, gold: 100 }
  },
  {
    id: 2,
    name: '积累资源',
    description: '收集100金币',
    type: 'resource_collect',
    target: 'gold',
    progress: 0,
    goal: 100,
    status: 'in_progress',
    rewards: { exp: 30, gold: 50 }
  },
  {
    id: 3,
    name: '筑基之路',
    description: '达到筑基境',
    type: 'realm_reach',
    target: '筑基',
    progress: 0,
    goal: 1,
    status: 'in_progress',
    rewards: { exp: 500, gold: 500 }
  }
]

// 主游戏组件
export default function XianXianGame() {
  // 游戏状态
  const [gameStarted, setGameStarted] = useState(false)
  const [showProfession, setShowProfession] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [selectedTalent, setSelectedTalent] = useState<Talent>('normal')

  const [player, setPlayer] = useState<Player>({
    name: '道友',
    profession: 'sword',
    talent: 'normal',
    level: 1,
    realm: '淬体',
    exp: 0,
    age: 16,
    lifespan: 100,
    sect: '',
    pet: '',
    attributes: {
      attack: 10,
      defense: 5,
      hp: 100,
      maxHp: 100,
      crit: 0.05
    }
  })

  const [resources, setResources] = useState({
    gold: 100,
    spiritStone: 10,
    pills: 5
  })

  const [equipment, setEquipment] = useState<{
    weapon: Equipment | null
    armor: Equipment | null
    accessory: Equipment | null
  }>({
    weapon: EQUIPMENT_SHOP[0], // 初始给一级武器
    armor: null,
    accessory: null
  })

  const [inventory, setInventory] = useState<Equipment[]>([])

  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)

  const [autoPlay, setAutoPlay] = useState(false)
  const [battleInProgress, setBattleInProgress] = useState(false)
  const [currentEnemy, setCurrentEnemy] = useState<Monster | null>(null)
  const [enemyHp, setEnemyHp] = useState(0)
  const [battleLog, setBattleLog] = useState<string[]>([])

  const [showAdventure, setShowAdventure] = useState(false)
  const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null)
  const [notifications, setNotifications] = useState<Array<{ id: number; title: string; message: string }>>([])
  const [hasSavedGame, setHasSavedGame] = useState(false)
  
  // 新增状态：商城、背包、门派修炼
  const [showShop, setShowShop] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showCultivation, setShowCultivation] = useState(false)
  const [cultivationCooldowns, setCultivationCooldowns] = useState<Record<string, number>>({})

  // 检查是否有存档（只在客户端执行）
  useEffect(() => {
    const checkSavedGame = () => {
      if (typeof window !== 'undefined') {
        setHasSavedGame(!!localStorage.getItem('xianxian-save'))
      }
    }
    checkSavedGame()
  }, [])

  const addNotification = useCallback((title: string, message: string) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, title, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  const playerRef = useRef(player)
  const resourcesRef = useRef(resources)
  const addNotificationRef = useRef(addNotification)

  useEffect(() => {
    playerRef.current = player
  }, [player])

  useEffect(() => {
    resourcesRef.current = resources
  }, [resources])

  useEffect(() => {
    addNotificationRef.current = addNotification
  }, [addNotification])

  const saveGame = useCallback(() => {
    if (!gameStarted) return
    const gameData = {
      player,
      resources,
      equipment,
      inventory,
      quests,
      autoPlay
    }
    localStorage.setItem('xianxian-save', JSON.stringify(gameData))
  }, [gameStarted, player, resources, equipment, inventory, quests, autoPlay])

  const resetGame = () => {
    if (confirm('确定要重新开始吗？这将清除所有进度！')) {
      localStorage.removeItem('xianxian-save')
      setGameStarted(false)
      setShowProfession(false)
      setAutoPlay(false)
      setBattleInProgress(false)
      setCurrentEnemy(null)
      setBattleLog([])
      addNotificationRef.current('提示', '游戏已重置')
    }
  }

  useEffect(() => {
    if (gameStarted) {
      const saveTimer = setTimeout(() => saveGame(), 1000)
      return () => clearTimeout(saveTimer)
    }
  }, [gameStarted, player, resources, equipment, inventory, quests, autoPlay, saveGame])

  const handleStartGame = () => {
    if (!playerName.trim()) {
      addNotification('提示', '请输入角色名称')
      return
    }
    setShowProfession(true)
  }

  const handleSelectProfession = (profession: Profession) => {
    const professionData = PROFESSIONS[profession]
    const talentBonus = TALENTS[selectedTalent].bonus

    setPlayer(prev => ({
      ...prev,
      name: playerName,
      profession,
      talent: selectedTalent,
      attributes: {
        attack: Math.floor(10 * talentBonus),
        defense: Math.floor(5 * talentBonus),
        hp: Math.floor(100 * talentBonus),
        maxHp: Math.floor(100 * talentBonus),
        crit: 0.05 * talentBonus
      }
    }))

    setGameStarted(true)
    setShowProfession(false)
    addNotification('欢迎', `欢迎${professionData.name}${playerName}踏上修仙之路！`)
  }

  const updateQuestProgress = useCallback((type: string, target: string, amount: number) => {
    setQuests(prev => prev.map(quest => {
      if (quest.status === 'in_progress' && quest.type === type) {
        if (type === 'monster_kill' && target === quest.target) {
          const newProgress = Math.min(quest.progress + amount, quest.goal)
          if (newProgress >= quest.goal) {
            addNotificationRef.current('任务完成', `恭喜！你完成了任务"${quest.name}"！`)
            return { ...quest, progress: newProgress, status: 'completed' as QuestStatus }
          }
          return { ...quest, progress: newProgress }
        }
        if (type === 'resource_collect' && target === quest.target) {
          const currentAmount = resourcesRef.current[target as keyof typeof resourcesRef.current] as number
          const newProgress = Math.min(currentAmount, quest.goal)
          if (newProgress >= quest.goal) {
            addNotificationRef.current('任务完成', `恭喜！你完成了任务"${quest.name}"！`)
            return { ...quest, progress: newProgress, status: 'completed' as QuestStatus }
          }
          return { ...quest, progress: newProgress }
        }
        if (type === 'realm_reach' && target === quest.target && playerRef.current.realm === target) {
          addNotificationRef.current('任务完成', `恭喜！你完成了任务"${quest.name}"！`)
          return { ...quest, progress: 1, status: 'completed' as QuestStatus }
        }
      }
      return quest
    }))
  }, [])

  const endBattle = useCallback((victory: boolean) => {
    if (victory && currentEnemy) {
      const expGained = currentEnemy.exp
      const goldGained = currentEnemy.gold

      setResources(prev => ({
        ...prev,
        gold: prev.gold + goldGained
      }))

      setPlayer(prev => {
        const newExp = prev.exp + expGained
        const newLevel = Math.floor(newExp / 100) + 1
        const talentBonus = TALENTS[prev.talent].bonus

        updateQuestProgress('monster_kill', currentEnemy.name, 1)
        updateQuestProgress('resource_collect', 'gold', 0)

        return {
          ...prev,
          exp: newExp,
          level: newLevel,
          age: prev.age + 1,
          attributes: {
            ...prev.attributes,
            hp: Math.min(prev.attributes.hp + 10, prev.attributes.maxHp)
          }
        }
      })

      const currentPlayer = playerRef.current
      const realmIndex = REALMS.indexOf(currentPlayer.realm)
      const newRealmIndex = Math.min(realmIndex + Math.floor(currentPlayer.exp / 200), REALMS.length - 1)
      if (newRealmIndex > realmIndex) {
        setPlayer(prev => ({
          ...prev,
          realm: REALMS[newRealmIndex],
          attributes: {
            ...prev.attributes,
            attack: prev.attributes.attack + 5,
            defense: prev.attributes.defense + 3,
            maxHp: prev.attributes.maxHp + 50,
            hp: prev.attributes.hp + 50
          }
        }))
        updateQuestProgress('realm_reach', REALMS[newRealmIndex], 1)
        addNotificationRef.current('境界突破', `恭喜！你突破到了${REALMS[newRealmIndex]}境！`)
      }

      if (Math.random() < currentEnemy.dropRate.spiritStone) {
        const amount = Math.floor(Math.random() * 3) + 1
        setResources(prev => ({ ...prev, spiritStone: prev.spiritStone + amount }))
        addNotificationRef.current('掉落', `获得${amount}颗灵石！`)
      }

      if (Math.random() < currentEnemy.dropRate.pill) {
        const amount = Math.floor(Math.random() * 2) + 1
        setResources(prev => ({ ...prev, pills: prev.pills + amount }))
        addNotificationRef.current('掉落', `获得${amount}颗丹药！`)
      }
      
      // 装备掉落
      if (Math.random() < currentEnemy.dropRate.equipment) {
        const droppedEquip = generateEquipmentDrop(currentEnemy.level)
        if (droppedEquip) {
          setInventory(prev => [...prev, droppedEquip])
          addNotificationRef.current('装备掉落', `获得了${droppedEquip.name}！`)
        }
      }

      addNotificationRef.current('战斗胜利', `击败${currentEnemy.name}！获得${expGained}经验，${goldGained}金币`)
    } else {
      setPlayer(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          hp: Math.floor(prev.attributes.maxHp * 0.5)
        }
      }))
      addNotificationRef.current('战斗失败', '你受了重伤，需要休养...')
    }

    setBattleInProgress(false)
    setCurrentEnemy(null)
  }, [currentEnemy, updateQuestProgress])

  const startBattle = useCallback(() => {
    if (battleInProgress) return
    const eligibleMonsters = MONSTERS.filter(m => m.level <= playerRef.current.level + 5)
    const monsterIndex = Math.floor(Math.random() * eligibleMonsters.length)
    const monster = { ...eligibleMonsters[monsterIndex] }
    setCurrentEnemy(monster)
    setEnemyHp(monster.hp)
    setBattleInProgress(true)
    setBattleLog([`遭遇了${monster.name}（Lv.${monster.level}）`])
  }, [battleInProgress])

  useEffect(() => {
    if (!battleInProgress || !currentEnemy) return

    const battleTimer = setInterval(() => {
      if (enemyHp <= 0 || player.attributes.hp <= 0) {
        clearInterval(battleTimer)
        endBattle(enemyHp <= 0)
        return
      }

      const playerDamage = Math.max(1, Math.floor(player.attributes.attack - currentEnemy.defense / 2))
      const isCrit = Math.random() < player.attributes.crit
      const finalDamage = isCrit ? Math.floor(playerDamage * 1.5) : playerDamage

      setEnemyHp(prev => {
        const newHp = Math.max(0, prev - finalDamage)
        if (newHp <= 0) {
          clearInterval(battleTimer)
          setTimeout(() => endBattle(true), 500)
        }
        return newHp
      })

      setBattleLog(prev => [
        ...prev.slice(-9),
        `你对${currentEnemy.name}造成${finalDamage}伤害${isCrit ? '（暴击！）' : ''}`
      ])

      setTimeout(() => {
        const enemyDamage = Math.max(1, Math.floor(currentEnemy.attack - player.attributes.defense / 2))
        setPlayer(prev => ({
          ...prev,
          attributes: {
            ...prev.attributes,
            hp: Math.max(0, prev.attributes.hp - enemyDamage)
          }
        }))
        setBattleLog(prev => [
          ...prev.slice(-9),
          `${currentEnemy.name}对你造成${enemyDamage}伤害`
        ])

        if (player.attributes.hp - enemyDamage <= 0) {
          clearInterval(battleTimer)
          setTimeout(() => endBattle(false), 500)
        }
      }, 500)
    }, 1000)

    return () => clearInterval(battleTimer)
  }, [battleInProgress, currentEnemy, player.attributes, enemyHp, endBattle])

  const claimQuestReward = (questId: number) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId && quest.status === 'completed') {
        setResources(prev => ({ ...prev, gold: prev.gold + quest.rewards.gold }))
        setPlayer(prev => ({ ...prev, exp: prev.exp + quest.rewards.exp }))
        return { ...quest, status: 'claimed' as QuestStatus }
      }
      return quest
    }))
  }

  const usePill = () => {
    if (resources.pills <= 0) {
      addNotification('提示', '丹药不足')
      return
    }
    setResources(prev => ({ ...prev, pills: prev.pills - 1 }))
    setPlayer(prev => ({ ...prev, exp: prev.exp + 50 }))
    addNotification('使用丹药', '获得50点经验！')
  }

  useEffect(() => {
    if (autoPlay && !battleInProgress && gameStarted) {
      const timer = setTimeout(() => startBattle(), 1000)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, battleInProgress, startBattle, gameStarted])

  const triggerAdventure = () => {
    const adventureIndex = Math.floor(Math.random() * ADVENTURES.length)
    setCurrentAdventure(ADVENTURES[adventureIndex])
    setShowAdventure(true)
  }

  const handleAdventureOption = (adventure: Adventure, optionId: number) => {
    const option = adventure.options.find(o => o.id === optionId)
    if (!option) return

    const result = option.result
    addNotification(result.success ? '奇遇结果' : '探索结果', result.message)

    if (result.rewards) {
      setResources(prev => ({
        ...prev,
        gold: prev.gold + (result.rewards.gold || 0),
        spiritStone: prev.spiritStone + (result.rewards.spiritStone || 0),
        pills: prev.pills + (result.rewards.pills || 0)
      }))

      setPlayer(prev => {
        const newAttributes = { ...prev.attributes }
        if (result.rewards.attributes) {
          if (result.rewards.attributes.attack) newAttributes.attack += result.rewards.attributes.attack
          if (result.rewards.attributes.defense) newAttributes.defense += result.rewards.attributes.defense
          if (result.rewards.attributes.hp) {
            newAttributes.maxHp += result.rewards.attributes.hp
            newAttributes.hp += result.rewards.attributes.hp
          }
          if (result.rewards.attributes.crit) newAttributes.crit += result.rewards.attributes.crit
        }
        return {
          ...prev,
          exp: prev.exp + (result.rewards.exp || 0),
          sect: result.rewards.sect || prev.sect,
          pet: result.rewards.pet || prev.pet,
          attributes: newAttributes
        }
      })

      if (result.rewards.lifespan) {
        setPlayer(prev => ({ ...prev, lifespan: prev.lifespan + result.rewards.lifespan! }))
      }
      
      // 处理装备掉落
      if (result.rewards.equipment) {
        addToInventory(result.rewards.equipment)
      }
    }

    setShowAdventure(false)
    setCurrentAdventure(null)
  }

  // 计算总属性（基础 + 装备）
  const getTotalAttributes = useCallback(() => {
    const base = player.attributes
    let total = { ...base }
    
    Object.values(equipment).forEach(item => {
      if (item) {
        if (item.attributes.attack) total.attack += item.attributes.attack
        if (item.attributes.defense) total.defense += item.attributes.defense
        if (item.attributes.hp) {
          total.maxHp += item.attributes.hp
          total.hp += item.attributes.hp
        }
        if (item.attributes.crit) total.crit += item.attributes.crit
      }
    })
    
    return total
  }, [player.attributes, equipment])

  // 装备物品
  const equipItem = (item: Equipment) => {
    const currentEquipped = equipment[item.type]
    
    // 卸下当前装备到背包
    if (currentEquipped) {
      setInventory(prev => [...prev, currentEquipped])
    }
    
    // 装备新物品
    setEquipment(prev => ({
      ...prev,
      [item.type]: item
    }))
    
    // 从背包移除
    setInventory(prev => prev.filter(i => i.id !== item.id))
    
    addNotification('装备', `已装备${item.name}`)
  }

  // 卸下装备
  const unequipItem = (type: EquipmentType) => {
    const item = equipment[type]
    if (!item) return
    
    setInventory(prev => [...prev, item])
    setEquipment(prev => ({
      ...prev,
      [type]: null
    }))
    
    addNotification('卸下', `已卸下${item.name}`)
  }

  // 添加到背包
  const addToInventory = (item: Equipment) => {
    setInventory(prev => [...prev, item])
    addNotification('获得装备', `获得了${item.name}！`)
  }

  // 出售装备
  const sellItem = (item: Equipment) => {
    const sellPrice = Math.floor(item.price * 0.9)
    setInventory(prev => prev.filter(i => i.id !== item.id))
    setResources(prev => ({ ...prev, gold: prev.gold + sellPrice }))
    addNotification('出售', `出售${item.name}，获得${sellPrice}金币`)
  }

  // 购买装备
  const buyItem = (item: Equipment) => {
    if (resources.gold < item.price) {
      addNotification('提示', '金币不足')
      return
    }
    
    setResources(prev => ({ ...prev, gold: prev.gold - item.price }))
    addToInventory(item)
  }

  // 门派修炼
  const practiceSkill = (cultivation: SectCultivation) => {
    // 检查冷却
    const now = Date.now()
    const lastPractice = cultivationCooldowns[cultivation.name] || 0
    if (now - lastPractice < cultivation.cooldown * 1000) {
      const remainingTime = Math.ceil((cultivation.cooldown * 1000 - (now - lastPractice)) / 1000 / 60)
      addNotification('提示', `修炼冷却中，还需${remainingTime}分钟`)
      return
    }
    
    // 检查资源
    if (resources.gold < cultivation.cost.gold || resources.spiritStone < cultivation.cost.spiritStone) {
      addNotification('提示', '资源不足')
      return
    }
    
    // 消耗资源
    setResources(prev => ({
      ...prev,
      gold: prev.gold - cultivation.cost.gold,
      spiritStone: prev.spiritStone - cultivation.cost.spiritStone
    }))
    
    // 获得奖励
    setPlayer(prev => {
      const newAttributes = { ...prev.attributes }
      if (cultivation.rewards.attributes) {
        if (cultivation.rewards.attributes.attack) newAttributes.attack += cultivation.rewards.attributes.attack
        if (cultivation.rewards.attributes.defense) newAttributes.defense += cultivation.rewards.attributes.defense
        if (cultivation.rewards.attributes.hp) {
          newAttributes.maxHp += cultivation.rewards.attributes.hp
          newAttributes.hp += cultivation.rewards.attributes.hp
        }
        if (cultivation.rewards.attributes.crit) newAttributes.crit += cultivation.rewards.attributes.crit
      }
      
      return {
        ...prev,
        exp: prev.exp + cultivation.rewards.exp,
        attributes: newAttributes
      }
    })
    
    // 设置冷却
    setCultivationCooldowns(prev => ({
      ...prev,
      [cultivation.name]: now
    }))
    
    addNotification('修炼成功', `完成${cultivation.name}修炼！`)
  }

  // 生成随机装备掉落
  const generateEquipmentDrop = (monsterLevel: number): Equipment | null => {
    const maxLevel = Math.min(Math.floor(monsterLevel / 5) + 1, 6)
    const possibleEquipment = EQUIPMENT_SHOP.filter(e => e.level <= maxLevel)
    if (possibleEquipment.length === 0) return null
    
    const randomEquip = possibleEquipment[Math.floor(Math.random() * possibleEquipment.length)]
    return { ...randomEquip, id: Date.now() + Math.random() } // 生成唯一ID
  }

  // ===== 登录界面 (新设计) =====
  if (!gameStarted && !showProfession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 dot-pattern text-foreground/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-[150px]" />

        <div className="relative z-10 w-full max-w-lg">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
              <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-primary">
                Idle Cultivation Game
              </span>
            </div>
            <h1 className="font-display text-[2.75rem] md:text-[5.25rem] leading-[1.05] tracking-tight text-foreground mb-4">
              修仙
              <span className="gradient-text">放置</span>
            </h1>
            <p className="text-muted-foreground text-lg">一键挂机，轻松飞升</p>
          </div>

          <Card className="border border-border/50 shadow-xl p-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">角色名称</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="请输入角色名称"
                  className="w-full h-12 px-4 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">先天体质</label>
                <select
                  value={selectedTalent}
                  onChange={(e) => setSelectedTalent(e.target.value as Talent)}
                  className="w-full h-12 px-4 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="normal">普通体质</option>
                  <option value="huanggu">荒古圣体</option>
                  <option value="xianti">先天圣体道胎</option>
                </select>
              </div>

              {hasSavedGame && (
                <Button
                  onClick={() => {
                    const savedData = localStorage.getItem('xianxian-save')
                    if (savedData) {
                      try {
                        const gameData = JSON.parse(savedData)
                        setPlayer(gameData.player)
                        setResources(gameData.resources)
                        setEquipment(gameData.equipment)
                        setInventory(gameData.inventory)
                        setQuests(gameData.quests)
                        setAutoPlay(gameData.autoPlay)
                        setGameStarted(true)
                      } catch (error) {
                        console.error('加载存档失败:', error)
                      }
                    }
                  }}
                  variant="outline"
                  className="w-full h-12 border-2 border-input hover:border-primary/50 font-semibold group transition-all duration-200"
                >
                  <Play className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                  继续游戏
                </Button>
              )}

              <Button
                onClick={handleStartGame}
                className="w-full h-14 gradient-primary text-white font-semibold shadow-sm hover:shadow-accent hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
              >
                开始修仙
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // ===== 职业选择界面 (新设计) =====
  if (showProfession) {
    return (
      <div className="min-h-screen bg-background p-4 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern text-foreground/30" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px]" />

        <div className="relative z-10 max-w-6xl mx-auto pt-16 pb-28">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-5 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
              <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-primary">
                Choose Your Path
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-[3.25rem] text-foreground mb-4">
              选择你的<span className="gradient-text">职业</span>
            </h2>
            <p className="text-muted-foreground text-lg">六大职业，各具特色</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(PROFESSIONS).map(([key, prof]) => {
              const Icon = prof.icon
              return (
                <Card
                  key={key}
                  onClick={() => handleSelectProfession(key as Profession)}
                  className="group p-6 border border-border/50 shadow-md hover:shadow-xl hover:shadow-accent cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-card"
                >
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl text-foreground mb-2">{prof.name}</h3>
                    <p className="text-sm text-muted-foreground">{prof.desc}</p>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => setShowProfession(false)}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              返回
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ===== 主游戏界面 (新设计) =====
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 通知 */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <Card key={notif.id} className="p-4 bg-card/95 backdrop-blur-sm border border-primary/30 shadow-lg animate-in slide-in-from-right">
            <div className="font-display font-semibold text-primary mb-1">{notif.title}</div>
            <div className="text-sm text-muted-foreground">{notif.message}</div>
          </Card>
        ))}
      </div>

      {/* 顶部资源栏 */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">{resources.gold}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4D7CFF]/20 to-primary/10 flex items-center justify-center">
                <Gem className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">{resources.spiritStone}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
                <Scroll className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="font-semibold text-foreground">{resources.pills}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowShop(true)}
              variant="outline"
              size="sm"
              className="h-10 border-2 border-input hover:border-primary/50 transition-all"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              商城
            </Button>

            <Button
              onClick={() => setShowInventory(true)}
              variant="outline"
              size="sm"
              className="h-10 border-2 border-input hover:border-primary/50 transition-all"
            >
              <Package className="w-4 h-4 mr-2" />
              背包({inventory.length})
            </Button>
            
            {player.sect && (
              <Button
                onClick={() => setShowCultivation(true)}
                variant="outline"
                size="sm"
                className="h-10 border-2 border-input hover:border-primary/50 transition-all"
              >
                <Scroll className="w-4 h-4 mr-2" />
                修炼
              </Button>
            )}

            <Button
              onClick={() => setAutoPlay(!autoPlay)}
              variant={autoPlay ? 'default' : 'outline'}
              size="sm"
              className={`h-10 transition-all duration-200 ${
                autoPlay
                  ? 'gradient-primary text-white shadow-sm hover:shadow-accent'
                  : 'border-2 border-input hover:border-primary/50'
              }`}
            >
              {autoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {autoPlay ? '自动挂机中' : '自动挂机'}
            </Button>

            <Button
              onClick={resetGame}
              variant="ghost"
              size="sm"
              className="h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 主游戏区域 */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        {/* 左侧角色信息卡片 */}
        <Card className="lg:w-80 bg-card border border-border/50 shadow-md p-6">
          <ScrollArea className="h-[calc(100vh-180px)] pr-4">
            {/* 角色头像和信息 */}
            <div className="text-center mb-8">
              <div className="w-28 h-28 mx-auto rounded-3xl gradient-primary p-[2px] shadow-sm animate-float-y">
                <div className="w-full h-full rounded-[calc(20px-2px)] bg-card flex items-center justify-center text-5xl font-display text-primary">
                  {PROFESSIONS[player.profession].name[0]}
                </div>
              </div>
              <h3 className="font-display text-2xl text-foreground mt-4">{player.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {PROFESSIONS[player.profession].name} · {TALENTS[player.talent].name}
              </p>
            </div>

            <Separator className="my-6 bg-border/50" />

            {/* 基础信息 */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">等级</span>
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  Lv.{player.level}
                </Badge>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">境界</span>
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  {player.realm}
                </Badge>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">年龄</span>
                <span className="text-sm font-medium text-foreground">{player.age}岁</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">寿命</span>
                <span className="text-sm font-medium text-foreground">{player.lifespan}岁</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">门派</span>
                <span className="text-sm font-medium text-foreground">{player.sect || '无'}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">灵兽</span>
                <span className="text-sm font-medium text-foreground">{player.pet || '未解锁'}</span>
              </div>
            </div>

            <Separator className="my-6 bg-border/50" />

            {/* 属性信息 */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">角色属性</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Swords className="w-4 h-4" />
                    <span className="text-xs text-muted-foreground">攻击</span>
                  </div>
                  <div className="font-display text-xl text-foreground">{player.attributes.attack}</div>
                </div>

                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs text-muted-foreground">防御</span>
                  </div>
                  <div className="font-display text-xl text-foreground">{player.attributes.defense}</div>
                </div>

                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs text-muted-foreground">生命</span>
                  </div>
                  <div className="font-display text-xl text-foreground">
                    {player.attributes.hp}/{player.attributes.maxHp}
                  </div>
                  <Progress value={(player.attributes.hp / player.attributes.maxHp) * 100} className="h-1.5 mt-2" />
                </div>

                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs text-muted-foreground">暴击</span>
                  </div>
                  <div className="font-display text-xl text-foreground">
                    {Math.floor(player.attributes.crit * 100)}%
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-border/50" />

            {/* 经验进度 */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">经验值</span>
                <span className="font-medium text-foreground">{player.exp % 100}/100</span>
              </div>
              <Progress value={player.exp % 100} className="h-2" />
            </div>

            {/* 装备栏 */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Gem className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">装备</h4>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/30 rounded-xl p-3 flex flex-col items-center border border-transparent hover:border-primary/30 transition-colors">
                  <Gavel className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    {equipment.weapon ? equipment.weapon.name : '武器'}
                  </span>
                </div>

                <div className="bg-muted/30 rounded-xl p-3 flex flex-col items-center border border-transparent hover:border-primary/30 transition-colors">
                  <Shield className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    {equipment.armor ? equipment.armor.name : '防具'}
                  </span>
                </div>

                <div className="bg-muted/30 rounded-xl p-3 flex flex-col items-center border border-transparent hover:border-primary/30 transition-colors">
                  <Gem className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    {equipment.accessory ? equipment.accessory.name : '饰品'}
                  </span>
                </div>
              </div>
            </div>

            {/* 使用丹药按钮 */}
            <Button
              onClick={usePill}
              disabled={resources.pills <= 0}
              className="w-full h-12 bg-muted/50 hover:bg-muted/80 text-foreground font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Scroll className="w-4 h-4 mr-2" />
              使用丹药 ({resources.pills})
            </Button>
          </ScrollArea>
        </Card>

        {/* 中间和右侧区域 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 战斗区域 */}
          <Card className="bg-card border border-border/50 shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Swords className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-xl text-foreground">战斗区域</h3>
              </div>
              {!battleInProgress && (
                <Button
                  onClick={startBattle}
                  className="gradient-primary text-white shadow-sm hover:shadow-accent hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
                >
                  <Play className="w-4 h-4 mr-2" />
                  开始战斗
                </Button>
              )}
            </div>

            {battleInProgress && currentEnemy ? (
              <div className="space-y-6">
                {/* 怪物信息 */}
                <Card className="p-5 bg-muted/30 border border-primary/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-display text-xl text-foreground mb-1">{currentEnemy.name}</div>
                      <div className="text-sm text-muted-foreground">等级: {currentEnemy.level}</div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      战斗中
                    </Badge>
                  </div>
                  <Progress
                    value={(enemyHp / currentEnemy.hp) * 100}
                    className="h-3"
                  />
                  <div className="text-sm text-muted-foreground mt-2">
                    {enemyHp}/{currentEnemy.hp}
                  </div>
                </Card>

                {/* 战斗日志 */}
                <Card className="p-4 bg-muted/20 border border-border/30">
                  <ScrollArea className="h-32">
                    <div className="space-y-1 font-mono-custom text-sm">
                      {battleLog.map((log, index) => (
                        <div key={index} className="text-muted-foreground">
                          {log}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto rounded-full bg-muted/30 flex items-center justify-center mb-6">
                  <Swords className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground">点击"开始战斗"按钮开始冒险</p>
              </div>
            )}
          </Card>

          {/* 任务和奇遇 */}
          <Card className="flex-1 bg-card border border-border/50 shadow-md p-6 min-h-[350px]">
            <Tabs defaultValue="quests" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="quests" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Scroll className="w-4 h-4 mr-2" />
                  任务
                </TabsTrigger>
                <TabsTrigger value="adventure" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  <Compass className="w-4 h-4 mr-2" />
                  奇遇
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quests" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[250px] pr-4">
                  <div className="space-y-3">
                    {quests.map(quest => (
                      <Card
                        key={quest.id}
                        className={`p-4 border transition-all hover:shadow-md ${
                          quest.status === 'completed'
                            ? 'border-primary/50 bg-primary/5'
                            : quest.status === 'claimed'
                            ? 'border-border/30 bg-muted/20 opacity-50'
                            : 'border-border/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold text-foreground mb-1">{quest.name}</div>
                            <div className="text-sm text-muted-foreground">{quest.description}</div>
                          </div>
                          <Badge
                            variant={
                              quest.status === 'completed'
                                ? 'default'
                                : quest.status === 'claimed'
                                ? 'secondary'
                                : 'outline'
                            }
                            className={
                              quest.status === 'completed'
                                ? 'bg-primary text-white'
                                : quest.status === 'claimed'
                                ? ''
                                : 'border-border/50'
                            }
                          >
                            {quest.status === 'completed'
                              ? '可领取'
                              : quest.status === 'claimed'
                              ? '已完成'
                              : '进行中'}
                          </Badge>
                        </div>
                        <Progress value={(quest.progress / quest.goal) * 100} className="h-2 mb-3" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {quest.progress}/{quest.goal}
                          </span>
                          {quest.status === 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => claimQuestReward(quest.id)}
                              className="gradient-primary text-white shadow-sm hover:shadow-accent h-9 px-4 transition-all duration-200"
                            >
                              <Gift className="w-4 h-4 mr-1" />
                              领取
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="adventure" className="flex-1 overflow-hidden">
                <div className="h-[250px] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full gradient-primary p-[2px] mb-6 animate-float-y">
                    <div className="w-full h-full rounded-[calc(40px-2px)] bg-card flex items-center justify-center">
                      <Compass className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">修仙路上充满奇遇</p>
                  <Button
                    onClick={triggerAdventure}
                    className="gradient-primary text-white shadow-sm hover:shadow-accent hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    探索奇遇
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* 奇遇弹窗 */}
      {showAdventure && currentAdventure && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-card border border-border/50 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-2xl text-foreground">{currentAdventure.title}</h3>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
                <span className="font-mono-custom text-[11px] uppercase tracking-[0.15em] text-primary">
                  {currentAdventure.description}
                </span>
              </div>

              <Card className="p-5 bg-muted/30 border border-border/30 mb-6">
                <p className="text-foreground/90 leading-relaxed">{currentAdventure.content}</p>
              </Card>

              <div className="space-y-3">
                {currentAdventure.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => handleAdventureOption(currentAdventure, option.id)}
                    variant={option.id === 1 ? 'default' : 'outline'}
                    className={`w-full h-12 transition-all duration-200 ${
                      option.id === 1
                        ? 'gradient-primary text-white shadow-sm hover:shadow-accent'
                        : 'border-2 border-input hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() => {
                  setShowAdventure(false)
                  setCurrentAdventure(null)
                }}
                variant="ghost"
                className="w-full mt-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                离开
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* 商城弹窗 */}
      {showShop && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] bg-card border border-border/50 shadow-2xl">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-2xl text-foreground">装备商城</h3>
              </div>
              <Button onClick={() => setShowShop(false)} variant="ghost" size="sm">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <ScrollArea className="h-[500px] p-6">
              <Tabs defaultValue="weapon">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="weapon">武器</TabsTrigger>
                  <TabsTrigger value="armor">防具</TabsTrigger>
                  <TabsTrigger value="accessory">饰品</TabsTrigger>
                </TabsList>
                
                {['weapon', 'armor', 'accessory'].map(type => (
                  <TabsContent key={type} value={type}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {EQUIPMENT_SHOP.filter(e => e.type === type).map(item => (
                        <Card key={item.id} className="p-4 border border-border/50 hover:border-primary/50 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className={`font-semibold ${QUALITY_COLORS[item.quality]} mb-1`}>{item.name}</div>
                              <div className="text-xs text-muted-foreground">Lv.{item.level}</div>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/30">{item.price}金币</Badge>
                          </div>
                          
                          <div className="space-y-1 mb-4 text-sm">
                            {item.attributes.attack && <div className="text-foreground">攻击: +{item.attributes.attack}</div>}
                            {item.attributes.defense && <div className="text-foreground">防御: +{item.attributes.defense}</div>}
                            {item.attributes.hp && <div className="text-foreground">生命: +{item.attributes.hp}</div>}
                            {item.attributes.crit && <div className="text-foreground">暴击: +{Math.floor(item.attributes.crit * 100)}%</div>}
                          </div>
                          
                          <Button 
                            onClick={() => buyItem(item)}
                            className="w-full gradient-primary text-white"
                            disabled={resources.gold < item.price}
                          >
                            <Coins className="w-4 h-4 mr-2" />
                            购买
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </ScrollArea>
          </Card>
        </div>
      )}

      {/* 背包弹窗 */}
      {showInventory && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] bg-card border border-border/50 shadow-2xl">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-2xl text-foreground">背包</h3>
              </div>
              <Button onClick={() => setShowInventory(false)} variant="ghost" size="sm">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <ScrollArea className="h-[500px] p-6">
              {inventory.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">背包空空如也</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inventory.map((item, index) => (
                    <Card key={`${item.id}-${index}`} className="p-4 border border-border/50 hover:border-primary/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className={`font-semibold ${QUALITY_COLORS[item.quality]} mb-1`}>{item.name}</div>
                          <div className="text-xs text-muted-foreground">Lv.{item.level} · {item.type === 'weapon' ? '武器' : item.type === 'armor' ? '防具' : '饰品'}</div>
                        </div>
                        <Badge className="bg-muted/50 text-foreground border-border/50">{Math.floor(item.price * 0.9)}金币</Badge>
                      </div>
                      
                      <div className="space-y-1 mb-4 text-sm">
                        {item.attributes.attack && <div className="text-foreground">攻击: +{item.attributes.attack}</div>}
                        {item.attributes.defense && <div className="text-foreground">防御: +{item.attributes.defense}</div>}
                        {item.attributes.hp && <div className="text-foreground">生命: +{item.attributes.hp}</div>}
                        {item.attributes.crit && <div className="text-foreground">暴击: +{Math.floor(item.attributes.crit * 100)}%</div>}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => equipItem(item)}
                          className="flex-1 gradient-primary text-white"
                        >
                          装备
                        </Button>
                        <Button 
                          onClick={() => sellItem(item)}
                          variant="outline"
                          className="flex-1"
                        >
                          出售
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      )}

      {/* 门派修炼弹窗 */}
      {showCultivation && player.sect && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[80vh] bg-card border border-border/50 shadow-2xl">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Scroll className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-2xl text-foreground">{player.sect}修炼</h3>
              </div>
              <Button onClick={() => setShowCultivation(false)} variant="ghost" size="sm">
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <ScrollArea className="h-[500px] p-6">
              {SECT_CULTIVATIONS.filter(c => c.sect === player.sect).length === 0 ? (
                <div className="text-center py-16">
                  <Scroll className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">暂无可用功法</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {SECT_CULTIVATIONS.filter(c => c.sect === player.sect).map(cultivation => {
                    const now = Date.now()
                    const lastPractice = cultivationCooldowns[cultivation.name] || 0
                    const remainingTime = Math.max(0, cultivation.cooldown * 1000 - (now - lastPractice))
                    const isOnCooldown = remainingTime > 0
                    
                    return (
                      <Card key={cultivation.name} className="p-5 border border-border/50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground text-lg mb-1">{cultivation.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{cultivation.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="text-foreground">{cultivation.cost.gold}金币</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Gem className="w-4 h-4 text-primary" />
                            <span className="text-foreground">{cultivation.cost.spiritStone}灵石</span>
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-3 mb-4 text-sm space-y-1">
                          <div className="text-foreground">经验: +{cultivation.rewards.exp}</div>
                          {cultivation.rewards.attributes?.attack && <div className="text-foreground">攻击: +{cultivation.rewards.attributes.attack}</div>}
                          {cultivation.rewards.attributes?.defense && <div className="text-foreground">防御: +{cultivation.rewards.attributes.defense}</div>}
                          {cultivation.rewards.attributes?.hp && <div className="text-foreground">生命: +{cultivation.rewards.attributes.hp}</div>}
                          {cultivation.rewards.attributes?.crit && <div className="text-foreground">暴击: +{Math.floor(cultivation.rewards.attributes.crit * 100)}%</div>}
                        </div>
                        
                        <Button 
                          onClick={() => practiceSkill(cultivation)}
                          className="w-full gradient-primary text-white"
                          disabled={isOnCooldown || resources.gold < cultivation.cost.gold || resources.spiritStone < cultivation.cost.spiritStone}
                        >
                          {isOnCooldown ? `冷却中 (${Math.ceil(remainingTime / 1000 / 60)}分钟)` : '开始修炼'}
                        </Button>
                      </Card>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  )
}
