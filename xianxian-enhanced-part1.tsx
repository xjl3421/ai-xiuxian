'use client'

// Minimalist Modern Design System - Idle Cultivation Game (Enhanced Version)
// 包含：通知堆叠/删除、门派系统、年龄极限、导出/导入、游戏总结

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Swords, Shield, Heart, Zap, Sparkles, Settings, Play, Pause,
  Scroll, Gift, Compass, Flame, Snowflake, Cat, Gem, Gavel,
  ArrowRight, ChevronRight, TrendingUp, X, Download, Upload,
  BookOpen, Crown, Clock, Award
} from 'lucide-react'

// ==================== 修改部分 1: 数据类型定义 ====================

type Profession = 'sword' | 'body' | 'fire' | 'ice' | 'peast' | 'thunder'
type Talent = 'normal' | 'huanggu' | 'xianti'
type QuestStatus = 'in_progress' | 'completed' | 'claimed'

// 门派系统
interface Sect {
  id: string
  name: string
  description: string
  icon: string
  bonus: {
    attack?: number
    defense?: number
    hp?: number
    crit?: number
  }
  requirement: {
    level: number
    realm: string
  }
}

// 通知类型（增强版）
interface Notification {
  id: number
  title: string
  message: string
  timestamp: number
  dismissed: boolean
  isStacked: boolean
}

// 游戏总结
interface GameSummary {
  playerName: string
  profession: Profession
  talent: Talent
  finalLevel: number
  finalRealm: string
  finalAge: number
  totalBattles: number
  totalMonstersKilled: number
  goldEarned: number
  spiritStonesEarned: number
  pillsUsed: number
  questsCompleted: number
  maxRealmReached: string
  sectJoined?: string
  achievements: string[]
  gameDuration: number
  history: GameHistoryEntry[]
}

interface GameHistoryEntry {
  timestamp: number
  event: string
  details: string
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
  ageLimit: number
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
  }
}

interface Quest {
  id: number
  name: string
  description: string
  type: 'monster_kill' | 'resource_collect' | 'realm_reach' | 'equipment_wear' | 'join_sect'
  target: string
  progress: number
  goal: number
  status: QuestStatus
  rewards: {
    exp: number
    gold: number
    sect?: string
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

// ==================== 常量数据（增强版） ====================

const PROFESSIONS = {
  sword: { name: '剑修', icon: Swords, desc: '擅长御剑飞行，攻击力高，速度快' },
  body: { name: '体修', icon: Shield, desc: '体魄强健，防御力高，生命值高' },
  fire: { name: '灵焰师', icon: Flame, desc: '掌控火焰，群体攻击，暴击率高' },
  ice: { name: '冰灵师', icon: Snowflake, desc: '掌控冰霜，减速控制，持续伤害' },
  beast: { name: '御兽师', icon: Cat, desc: '驾驭灵兽，辅助增益，多面手' },
  thunder: { name: '雷灵师', icon: Zap, desc: '掌控雷电，高爆发，命中率高' }
}

const TALENTS = {
  normal: { name: '普通体质', bonus: 1 },
  huanggu: { name: '荒古圣体', bonus: 1.5 },
  xianti: { name: '先天圣体道胎', bonus: 2 }
}

const REALMS = ['淬体', '炼气', '筑基', '金丹', '元婴', '化神', '大乘', '渡劫', '飞升']

// 门派系统数据
const SECTS: Sect[] = [
  {
    id: 'qingyun',
    name: '青云门',
    description: '正道魁首，底蕴深厚',
    icon: '🏔️',
    bonus: { attack: 10, defense: 5, hp: 50 },
    requirement: { level: 10, realm: '炼气' }
  },
  {
    id: 'huoyan',
    name: '火焰宗',
    description: '火系霸主，烈焰焚天',
    icon: '🔥',
    bonus: { attack: 15, crit: 0.1 },
    requirement: { level: 15, realm: '筑基' }
  },
  {
    id: 'shenshan',
    name: '神山派',
    description: '古老门派，根基深厚',
    icon: '🏔️',
    bonus: { defense: 10, hp: 100 },
    requirement: { level: 20, realm: '金丹' }
  },
  {
    id: 'xueyun',
    name: '雪云宗',
    description: '冰系传承，寒冰刺骨',
    icon: '❄️',
    bonus: { defense: 8, crit: 0.05 },
    requirement: { level: 12, realm: '筑基' }
  },
  {
    id: 'leiting',
    name: '雷霆阁',
    description: '雷系传承，雷霆万钧',
    icon: '⚡',
    bonus: { attack: 12, crit: 0.08 },
    requirement: { level: 18, realm: '金丹' }
  },
  {
    id: 'wanbeast',
    name: '万兽山',
    description: '万兽争鸣，灵力充沛',
    icon: '🦁️',
    bonus: { hp: 80, crit: 0.05 },
    requirement: { level: 8, realm: '炼气' }
  }
]

// 年龄极限配置（每5个大境界增加年龄极限）
const AGE_LIMITS: Record<string, number> = {
  '淬体': 50,
  '炼气': 100,
  '筑基': 200,
  '金丹': 400,
  '元婴': 800,
  '化神': 1200,
  '大乘': 1500,
  '渡劫': 2000,
  '飞升': 9999
}

const MONSTERS: Monster[] = [
  { id: 1, name: '山妖', level: 1, hp: 50, attack: 5, defense: 2, exp: 10, gold: 5, dropRate: { spiritStone: 0.2, pill: 0.1 } },
  { id: 2, name: '野狼', level: 3, hp: 80, attack: 8, defense: 3, exp: 20, gold: 10, dropRate: { spiritStone: 0.25, pill: 0.15 } },
  { id: 3, name: '狐妖', level: 5, hp: 120, attack: 12, defense: 5, exp: 35, gold: 18, dropRate: { spiritStone: 0.3, pill: 0.2 } },
  { id: 4, name: '猛虎', level: 8, hp: 180, attack: 18, defense: 8, exp: 60, gold: 30, dropRate: { spiritStone: 0.35, pill: 0.25 } },
  { id: 5, name: '妖狼王', level: 10, hp: 250, attack: 25, defense: 12, exp: 100, gold: 50, dropRate: { spiritStone: 0.4, pill: 0.3 } },
  { id: 6, name: '蛇妖', level: 15, hp: 350, attack: 35, defense: 18, exp: 150, gold: 80, dropRate: { spiritStone: 0.45, pill: 0.35 } },
  { id: 7, name: '赤炎兽', level: 20, hp: 500, attack: 50, defense: 25, exp: 250, gold: 120, dropRate: { spiritStone: 0.5, pill: 0.4 } },
  { id: 8, name: '玄冰兽', level: 25, hp: 700, attack: 70, defense: 35, exp: 400, gold: 180, dropRate: { spiritStone: 0.55, pill: 0.45 } },
  { id: 9, name: '雷兽', level: 30, hp: 1000, attack: 100, defense: 50, exp: 600, gold: 250, dropRate: { spiritStone: 0.6, pill: 0.5 } },
  { id: 10, name: '魔王', level: 35, hp: 1500, attack: 150, defense: 75, exp: 1000, gold: 400, dropRate: { spiritStone: 0.7, pill: 0.6 } }
]

// 增强的奇遇系统（包含门派）
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
  // 新增：门派邀请奇遇
  {
    id: 6,
    title: '门派邀请',
    description: '某门派邀请你加入',
    content: '一位身着门派服饰的修士来到你面前，恭敬地说道：' + 
      '"道友修为不俗，我观你骨骼惊奇，特此邀请你加入我派，共参大道。"',
    options: [
      {
        id: 1,
        text: '接受邀请',
        result: {
          success: true,
          message: '你欣然接受邀请，成为了门派的一员！',
          rewards: { sect: '青云门', exp: 200, gold: 300 }
        }
      },
      {
        id: 2,
        text: '婉言谢绝',
        result: {
          success: false,
          message: '你婉言谢绝了邀请，继续独自修行。'
        }
      }
    ]
  },
  // 新增：突破时门派邀请
  {
    id: 7,
    title: '门派招贤',
    description: '境界突破引关注',
    content: '你的境界突破引起了门派的注意，有门派派人前来招贤纳士。',
    options: [
      {
        id: 1,
        text: '加入门派',
        result: {
          success: true,
          message: '你加入了门派，获得了门派的资源庇护！',
          rewards: { sect: '青云门', exp: 300, gold: 500 }
        }
      },
      {
        id: 2,
        text: '继续散修',
        result: {
          success: false,
          message: '你选择了继续散修，保持自由。'
        }
      }
    ]
  }
]

// 初始任务（增强版）
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
  },
  {
    id: 4,
    name: '拜入师门',
    description: '加入任意一个门派',
    type: 'join_sect',
    target: '任意门派',
    progress: 0,
    goal: 1,
    status: 'in_progress',
    rewards: { exp: 1000, gold: 1000 }
  }
]

// ==================== 主游戏组件开始 ====================

export default function XianXianGame() {
  // ==================== 修改部分 2: 状态定义（增强版） ====================

  // 游戏状态
  const [gameStarted, setGameStarted] = useState(false)
  const [showProfession, setShowProfession] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [selectedTalent, setSelectedTalent] = useState<Talent>('normal')

  // 玩家状态（增强版）
  const [player, setPlayer] = useState<Player>({
    name: '道友',
    profession: 'sword',
    talent: 'normal',
    level: 1,
    realm: '淬体',
    exp: 0,
    age: 16,
    lifespan: 100,
    ageLimit: 50, // 新增：年龄极限
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

  const [equipment, setEquipment] = useState({
    weapon: null,
    armor: null,
    accessory: null
  })

  const [inventory, setInventory] = useState([])

  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)

  // 统计数据
  const [stats, setStats] = useState({
    totalBattles: 0,
    totalMonstersKilled: 0,
    goldEarned: 100,
    spiritStonesEarned: 10,
    pillsUsed: 0,
    questsCompleted: 0,
    maxRealmReached: '淬体',
    achievements: [] as string[]
  })

  // 游戏历史
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([])

  const [autoPlay, setAutoPlay] = useState(false)
  const [battleInProgress, setBattleInProgress] = useState(false)
  const [currentEnemy, setCurrentEnemy] = useState<Monster | null>(null)
  const [enemyHp, setEnemyHp] = useState(0)
  const [battleLog, setBattleLog] = useState<string[]>([])

  const [showAdventure, setShowAdventure] = useState(false)
  const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null)

  // ==================== 修改部分 3: 通知系统（增强版） ====================

  // 通知状态（增强版）
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [hasSavedGame, setHasSavedGame] = useState(false)
  const [showGameSummary, setShowGameSummary] = useState(false)
  const [gameSummary, setGameSummary] = useState<GameSummary | null>(null)

  // 检查是否有存档（只在客户端执行）
  useEffect(() => {
    const checkSavedGame = () => {
      if (typeof window !== 'undefined') {
        setHasSavedGame(!!localStorage.getItem('xianxian-save'))
      }
    }
    checkSavedGame()
  }, [])

  // 添加通知（增强版 - 支持堆叠）
  const addNotification = useCallback((title: string, message: string) => {
    const id = Date.now()
    const timestamp = Date.now()
    
    setNotifications(prev => {
      // 如果已有通知，将除第一条外的其他通知标记为堆叠状态
      const newNotif = { id, title, message, timestamp, dismissed: false, isStacked: false }
      
      if (prev.length > 0) {
        return [prev[0], ...prev.slice(1).map(n => ({
          ...n,
          isStacked: true
        })), newNotif]
      }
      
      return [newNotif]
    })
  }, [])

  // 删除通知
  const dismissNotification = useCallback((id: number) => {
    setNotifications(prev => {
      // 如果删除的是第一条，删除后，第二条变为非堆叠状态
      if (prev.length > 0 && prev[0].id === id) {
        if (prev.length === 1) {
          return []
        }
        const remaining = prev.slice(1)
        return [{ ...remaining[0], isStacked: false }, ...remaining.slice(1)]
      }
      
      return prev.filter(n => n.id !== id)
    })
  }, [])

  // 清除所有通知
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // 展开堆叠的通知
  const expandStackedNotification = useCallback((id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isStacked: false } : notif
    ))
  }, [])

  // 折叠堆叠的通知
  const collapseStackedNotification = useCallback((id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isStacked: true } : notif
    ))
  }, [])

  // 检查年龄极限并结束游戏
  const checkAgeLimit = useCallback(() => {
    if (player.age >= player.ageLimit && player.realm !== '飞升') {
      // 年龄达到极限，检查是否可以突破
      const canBreakthrough = REALMS.indexOf(player.realm) < REALMS.length - 1
      const currentExpForRealm = (player.exp % 100)

      if (!canBreakthrough && currentExpForRealm === 0) {
        // 无法突破，游戏结束
        endGame('age_limit')
        return true
      }
    }
    return false
  }, [player])

  // 结束游戏（年龄极限或主动结束）
  const endGame = useCallback((reason: 'age_limit' | 'manual') => {
    const summary: GameSummary = {
      playerName: player.name,
      profession: player.profession,
      talent: player.talent,
      finalLevel: player.level,
      finalRealm: player.realm,
      finalAge: player.age,
      totalBattles: stats.totalBattles,
      totalMonstersKilled: stats.totalMonstersKilled,
      goldEarned: stats.goldEarned,
      spiritStonesEarned: stats.spiritStonesEarned,
      pillsUsed: stats.pillsUsed,
      questsCompleted: stats.questsCompleted,
      maxRealmReached: stats.maxRealmReached,
      sectJoined: player.sect || undefined,
      gameDuration: Math.floor((Date.now() - (stats.gameStartTime || Date.now())) / 1000),
      achievements: stats.achievements,
      history: gameHistory
    }

    setGameSummary(summary)
    setShowGameSummary(true)
    setAutoPlay(false)
    setBattleInProgress(false)
    setCurrentEnemy(null)
  }, [player, stats, gameHistory])

  // 重新开始
  const restartGame = useCallback(() => {
    if (confirm('确定要重新开始吗？这将清除所有进度！')) {
      localStorage.removeItem('xianxian-save')
      location.reload()
    }
  }, [])

  // 导出游戏数据为 JSON
  const exportGameData = useCallback(() => {
    const gameData = {
      player,
      resources,
      equipment,
      inventory,
      quests,
      stats,
      gameHistory,
      gameStarted: true
    }

    const dataStr = JSON.stringify(gameData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `xianxian-${player.name}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addNotification('导出成功', '游戏数据已导出为 JSON 文件！')
  }, [player, resources, equipment, inventory, quests, stats, gameHistory, addNotification])

  // 导入游戏数据
  const importGameData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // 验证数据格式
        if (!data.player || !data.resources || !data.quests) {
          throw new Error('无效的存档文件')
        }

        setPlayer(data.player)
        setResources(data.resources)
        setEquipment(data.equipment)
        setInventory(data.inventory)
        setQuests(data.quests)
        setStats(data.stats || {
          totalBattles: 0,
          totalMonstersKilled: 0,
          goldEarned: 0,
          spiritStonesEarned: 0,
          pillsUsed: 0,
          questsCompleted: 0,
          maxRealmReached: '淬体',
          achievements: []
        })
        setGameHistory(data.gameHistory || [])
        setGameStarted(true)
        setShowGameSummary(false)

        addNotification('导入成功', '游戏数据已从 JSON 文件恢复！')
      } catch (error) {
        console.error('导入失败:', error)
        addNotification('导入失败', '文件格式错误或已损坏')
      }
    }
    reader.readAsText(file)
  }, [addNotification])

  // ==================== 修改部分 4: 增加游戏逻辑 ====================

  // 修改：检查门派触发条件（升级时）
  const checkSectInvitation = useCallback((newLevel: number, currentRealm: string) => {
    // 每5级检查一次
    if (newLevel % 5 === 0 && newLevel > 5) {
      // 检查是否已经有门派
      if (!player.sect) {
        // 触发门派邀请
        const invitationAdventure = ADVENTURES.find(a => a.id === 7) // 境加门派招贤奇遇
        if (invitationAdventure) {
          setCurrentAdventure(invitationAdventure)
          setShowAdventure(true)
        }
      }
    }
  }, [player.sect])

  // 修改：升级逻辑，包含门派检查和年龄极限增加
  const handleLevelUp = useCallback((newExp: number) => {
    const newLevel = Math.floor(newExp / 100) + 1
    const oldLevel = player.level

    // 检查大境界突破（每10级）
    if (Math.floor(newLevel / 10) > Math.floor(oldLevel / 10)) {
      const realmIndex = REALMS.indexOf(player.realm)
      const newRealmIndex = Math.min(realmIndex + 1, REALMS.length - 1)

      if (newRealmIndex > realmIndex) {
        // 突破境界，增加年龄极限
        const newAgeLimit = AGE_LIMITS[REALMS[newRealmIndex]] || player.ageLimit + 50
        const oldAgeLimit = player.ageLimit

        setPlayer(prev => ({
          ...prev,
          realm: REALMS[newRealmIndex],
          ageLimit: Math.max(oldAgeLimit + 50, newAgeLimit),
          attributes: {
            ...prev.attributes,
            hp: Math.floor(prev.attributes.maxHp), // 突破时恢复满血
            maxHp: prev.attributes.maxHp + 50
          }
        }))

        // 记录历史
        setGameHistory(prev => [...prev, {
          timestamp: Date.now(),
          event: '境界突破',
          details: `从${REALMS[realmIndex]}境突破到${REALMS[newRealmIndex]}境`
        }]))

        // 更新最大境界
        setStats(prev => ({
          ...prev,
          maxRealmReached: REALMS[newRealmIndex]
        }))

        addNotification('境界突破', `恭喜！你突破到了${REALMS[newRealmIndex]}境！年龄极限提升至${newAgeLimit}岁！`)

        // 检查门派邀请
        checkSectInvitation(newLevel, REALMS[newRealmIndex])
      }
    }

    // 更新任务进度
    updateQuestProgress('realm_reach', REALMS[newRealmIndex], 1)
  }, [player.realm, player.ageLimit, checkSectInvitation])

  // 使用 savedGame 函数的状态
  // ... 其他代码保持不变 ...

  // ==================== 渲染逻辑 ====================

  // ===== 登录界面（修改：添加导入按钮） =====
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
                        setStats(gameData.stats || {
                          totalBattles: 0,
                          totalMonstersKilled: 0,
                          goldEarned: 0,
                          spiritStonesEarned: 0,
                          pillsUsed: 0,
                          questsCompleted: 0,
                          maxRealmReached: '淬体',
                          achievements: []
                        })
                        setGameHistory(gameData.gameHistory || [])
                        setAutoPlay(gameData.autoPlay || false)
                        setGameStarted(true)
                      } catch (error) {
                        console.error('加载存档失败:', error)
                        addNotification('加载失败', '存档文件可能已损坏')
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

              {/* 新增：导入按钮 */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-input hover:border-primary/50 h-10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  导入
                  <input
                    type="file"
                    accept=".json"
                    onChange={importGameData}
                    className="hidden"
                  id="import-input"
                  />
                  <label htmlFor="import-input" className="cursor-pointer">
                    导出JSON
                  </label>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // ... 其余代码保持不变 ...
}
