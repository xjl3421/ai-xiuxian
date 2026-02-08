'use client'

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
  Gavel
} from 'lucide-react'

// 游戏数据类型定义
type Profession = 'sword' | 'body' | 'fire' | 'ice' | 'thunder' | 'beast'
type Talent = 'normal' | 'huanggu' | 'xianti'
type Quality = 'white' | 'green' | 'blue' | 'purple' | 'orange' | 'red'
type QuestStatus = 'in_progress' | 'completed' | 'claimed'

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

interface Equipment {
  id: number
  name: string
  type: 'weapon' | 'armor' | 'accessory'
  quality: Quality
  attack: number
  defense: number
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

// 常量数据
const PROFESSIONS = {
  sword: { name: '剑修', icon: Swords, color: 'text-blue-500', desc: '擅长御剑飞行，攻击力高，速度快' },
  body: { name: '体修', icon: Shield, color: 'text-yellow-500', desc: '体魄强健，防御力高，生命值高' },
  fire: { name: '灵焰师', icon: Flame, color: 'text-red-500', desc: '掌控火焰，群体攻击，暴击率高' },
  ice: { name: '冰灵师', icon: Snowflake, color: 'text-cyan-500', desc: '掌控冰霜，减速控制，持续伤害' },
  thunder: { name: '雷灵师', icon: Zap, color: 'text-purple-500', desc: '掌控雷电，高爆发，命中率高' },
  beast: { name: '御兽师', icon: Cat, color: 'text-green-500', desc: '驾驭灵兽，辅助增益，多面手' }
}

const TALENTS = {
  normal: { name: '普通体质', bonus: 1 },
  huanggu: { name: '荒古圣体', bonus: 1.5 },
  xianti: { name: '先天圣体道胎', bonus: 2 }
}

const REALMS = ['淬体', '炼气', '筑基', '金丹', '元婴', '化神', '大乘', '渡劫', '飞升']

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
  }
]

// 初始任务
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

  const [equipment, setEquipment] = useState({
    weapon: null as Equipment | null,
    armor: null as Equipment | null,
    accessory: null as Equipment | null
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

  // 添加通知
  const addNotification = useCallback((title: string, message: string) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, title, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  // 使用 ref 来存储最新状态，避免依赖问题
  const playerRef = useRef(player)
  const resourcesRef = useRef(resources)
  const addNotificationRef = useRef(addNotification)

  // 同步 ref 值
  useEffect(() => {
    playerRef.current = player
  }, [player])

  useEffect(() => {
    resourcesRef.current = resources
  }, [resources])

  useEffect(() => {
    addNotificationRef.current = addNotification
  }, [addNotification])

  // 保存游戏
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

  // 重置游戏
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

  // 游戏状态变化时自动保存
  useEffect(() => {
    if (gameStarted) {
      const saveTimer = setTimeout(() => saveGame(), 1000)
      return () => clearTimeout(saveTimer)
    }
  }, [gameStarted, player, resources, equipment, inventory, quests, autoPlay, saveGame])

  // 开始游戏
  const handleStartGame = () => {
    if (!playerName.trim()) {
      addNotification('提示', '请输入角色名称')
      return
    }
    setShowProfession(true)
  }

  // 选择职业
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

  // 更新任务进度
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
          addNotification('任务完成', `恭喜！你完成了任务"${quest.name}"！`)
          return { ...quest, progress: 1, status: 'completed' as QuestStatus }
        }
      }
      return quest
    }))
  }, [])

  // 结束战斗
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

        // 更新任务进度
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

      // 检查境界突破
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

      // 掉落奖励
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

      addNotificationRef.current('战斗胜利', `击败${currentEnemy.name}！获得${expGained}经验，${goldGained}金币`)
    } else {
      // 恢复一些生命值
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

  // 开始战斗
  const startBattle = useCallback(() => {
    if (battleInProgress) return

    // 根据等级选择合适的怪物
    const eligibleMonsters = MONSTERS.filter(m => m.level <= playerRef.current.level + 5)
    const monsterIndex = Math.floor(Math.random() * eligibleMonsters.length)
    const monster = { ...eligibleMonsters[monsterIndex] }

    setCurrentEnemy(monster)
    setEnemyHp(monster.hp)
    setBattleInProgress(true)
    setBattleLog([`遭遇了${monster.name}（Lv.${monster.level}）`])
  }, [battleInProgress])

  // 战斗循环
  useEffect(() => {
    if (!battleInProgress || !currentEnemy) return

    const battleTimer = setInterval(() => {
      if (enemyHp <= 0 || player.attributes.hp <= 0) {
        clearInterval(battleTimer)
        endBattle(enemyHp <= 0)
        return
      }

      // 玩家攻击
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

      // 怪物攻击
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

  // 领取任务奖励
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

  // 使用丹药
  const usePill = () => {
    if (resources.pills <= 0) {
      addNotification('提示', '丹药不足')
      return
    }
    setResources(prev => ({ ...prev, pills: prev.pills - 1 }))
    setPlayer(prev => ({ ...prev, exp: prev.exp + 50 }))
    addNotification('使用丹药', '获得50点经验！')
  }

  // 自动战斗
  useEffect(() => {
    if (autoPlay && !battleInProgress && gameStarted) {
      const timer = setTimeout(() => startBattle(), 1000)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, battleInProgress, startBattle, gameStarted])

  // 触发奇遇
  const triggerAdventure = () => {
    const adventureIndex = Math.floor(Math.random() * ADVENTURES.length)
    setCurrentAdventure(ADVENTURES[adventureIndex])
    setShowAdventure(true)
  }

  // 处理奇遇选择
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
    }

    setShowAdventure(false)
    setCurrentAdventure(null)
  }

  // 渲染登录界面
  if (!gameStarted && !showProfession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920')] bg-cover bg-center" />
        <Card className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-sm border-amber-500/30">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">修仙放置</h1>
            <p className="text-slate-400">一键挂机，轻松飞升</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">角色名称</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="请输入角色名称"
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">先天体质</label>
              <select
                value={selectedTalent}
                onChange={(e) => setSelectedTalent(e.target.value as Talent)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="normal">普通体质</option>
                <option value="huanggu">荒古圣体</option>
                <option value="xianti">先天圣体道胎</option>
              </select>
            </div>
            {localStorage.getItem('xianxian-save') && (
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
                className="w-full py-3 border-blue-500 text-blue-400 hover:bg-blue-500/10 font-bold"
              >
                <Play className="w-4 h-4 mr-2" />
                继续游戏
              </Button>
            )}
            <Button
              onClick={handleStartGame}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold"
            >
              开始修仙
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // 渲染职业选择界面
  if (showProfession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920')] bg-cover bg-center" />
        <div className="relative z-10 max-w-6xl mx-auto pt-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">选择职业</h2>
            <p className="text-slate-400">六大职业，各具特色</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(PROFESSIONS).map(([key, prof]) => {
              const Icon = prof.icon
              return (
                <Card
                  key={key}
                  onClick={() => handleSelectProfession(key as Profession)}
                  className="p-6 bg-slate-900/80 backdrop-blur-sm border-2 border-slate-700 hover:border-amber-500 cursor-pointer transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 ${prof.color}`}>
                      <Icon size={32} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${prof.color}`}>{prof.name}</h3>
                    <p className="text-sm text-slate-400">{prof.desc}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // 渲染主游戏界面
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
      {/* 通知 */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <Card key={notif.id} className="p-4 bg-slate-800/95 backdrop-blur-sm border-amber-500/50 animate-in slide-in-from-right">
            <div className="font-bold text-amber-400">{notif.title}</div>
            <div className="text-sm text-slate-300">{notif.message}</div>
          </Card>
        ))}
      </div>

      {/* 顶部资源栏 */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-amber-500/30 p-2 md:p-4 sticky top-0 z-40">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-amber-400 font-bold">{resources.gold}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Gem className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-blue-400 font-bold">{resources.spiritStone}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Scroll className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-purple-400 font-bold">{resources.pills}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setAutoPlay(!autoPlay)}
              variant={autoPlay ? 'default' : 'outline'}
              size="sm"
              className={autoPlay ? 'bg-green-600 hover:bg-green-700' : 'border-green-500/50 text-green-400'}
            >
              {autoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {autoPlay ? '自动挂机中' : '自动挂机'}
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 主游戏区域 */}
      <div className="flex-1 container mx-auto p-4 flex flex-col lg:flex-row gap-4">
        {/* 左侧角色信息 */}
        <Card className="w-full lg:w-80 bg-slate-900/80 backdrop-blur-sm border-amber-500/30 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)] p-4">
            {/* 角色头像和信息 */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold mb-3">
                {PROFESSIONS[player.profession].name[0]}
              </div>
              <h3 className="text-xl font-bold text-amber-400">{player.name}</h3>
              <p className={`text-sm ${PROFESSIONS[player.profession].color}`}>
                {PROFESSIONS[player.profession].name}
              </p>
              <p className="text-xs text-slate-400 mt-1">{TALENTS[player.talent].name}</p>
            </div>

            <Separator className="my-4 bg-slate-700" />

            {/* 基础信息 */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">等级</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  Lv.{player.level}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">境界</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  {player.realm}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">年龄</span>
                <span className="text-slate-200">{player.age}岁</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">寿命</span>
                <span className="text-red-400">{player.lifespan}岁</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">门派</span>
                <span className="text-slate-200">{player.sect || '无'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">灵兽</span>
                <span className="text-green-400">{player.pet || '未解锁'}</span>
              </div>
            </div>

            <Separator className="my-4 bg-slate-700" />

            {/* 属性信息 */}
            <div className="space-y-3 mb-4">
              <h4 className="font-bold text-slate-200">角色属性</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-red-400">
                    <Swords className="w-4 h-4" />
                    <span className="text-sm">攻击</span>
                  </div>
                  <div className="text-lg font-bold text-slate-200">{player.attributes.attack}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">防御</span>
                  </div>
                  <div className="text-lg font-bold text-slate-200">{player.attributes.defense}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">生命</span>
                  </div>
                  <div className="text-lg font-bold text-slate-200">
                    {player.attributes.hp}/{player.attributes.maxHp}
                  </div>
                  <Progress
                    value={(player.attributes.hp / player.attributes.maxHp) * 100}
                    className="h-1 mt-1"
                  />
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">暴击</span>
                  </div>
                  <div className="text-lg font-bold text-slate-200">
                    {Math.floor(player.attributes.crit * 100)}%
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-slate-700" />

            {/* 经验进度 */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">经验值</span>
                <span className="text-slate-200">{player.exp % 100}/100</span>
              </div>
              <Progress value={player.exp % 100} className="h-2" />
            </div>

            {/* 装备栏 */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200">装备</h4>
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-2 bg-slate-800/50 border-slate-700 flex flex-col items-center">
                  <Gavel className="w-8 h-8 text-blue-400 mb-1" />
                  <span className="text-xs text-slate-400">
                    {equipment.weapon ? equipment.weapon.name : '武器'}
                  </span>
                </Card>
                <Card className="p-2 bg-slate-800/50 border-slate-700 flex flex-col items-center">
                  <Shield className="w-8 h-8 text-blue-400 mb-1" />
                  <span className="text-xs text-slate-400">
                    {equipment.armor ? equipment.armor.name : '防具'}
                  </span>
                </Card>
                <Card className="p-2 bg-slate-800/50 border-slate-700 flex flex-col items-center">
                  <Gem className="w-8 h-8 text-blue-400 mb-1" />
                  <span className="text-xs text-slate-400">
                    {equipment.accessory ? equipment.accessory.name : '饰品'}
                  </span>
                </Card>
              </div>
            </div>

            {/* 使用丹药按钮 */}
            <Button
              onClick={usePill}
              disabled={resources.pills <= 0}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
            >
              <Scroll className="w-4 h-4 mr-2" />
              使用丹药 ({resources.pills})
            </Button>
          </ScrollArea>
        </Card>

        {/* 中间和右侧区域 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 战斗区域 */}
          <Card className="bg-slate-900/80 backdrop-blur-sm border-amber-500/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Swords className="w-5 h-5 text-red-400" />
                战斗区域
              </h3>
              {!battleInProgress && (
                <Button onClick={startBattle} size="sm" className="bg-red-600 hover:bg-red-700">
                  <Play className="w-4 h-4 mr-2" />
                  开始战斗
                </Button>
              )}
            </div>

            {battleInProgress && currentEnemy ? (
              <div className="space-y-4">
                {/* 怪物信息 */}
                <Card className="p-4 bg-slate-800/50 border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xl font-bold text-red-400">{currentEnemy.name}</div>
                      <div className="text-sm text-slate-400">等级: {currentEnemy.level}</div>
                    </div>
                    <Badge variant="destructive">战斗中</Badge>
                  </div>
                  <Progress
                    value={(enemyHp / currentEnemy.hp) * 100}
                    className="h-3"
                  />
                  <div className="text-sm text-slate-400 mt-1">
                    {enemyHp}/{currentEnemy.hp}
                  </div>
                </Card>

                {/* 战斗日志 */}
                <Card className="p-3 bg-slate-800/30 border-slate-700">
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {battleLog.map((log, index) => (
                        <div key={index} className="text-sm text-slate-300">
                          {log}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Swords className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>点击"开始战斗"按钮开始冒险</p>
              </div>
            )}
          </Card>

          {/* 任务和奇遇 */}
          <Card className="flex-1 bg-slate-900/80 backdrop-blur-sm border-amber-500/30 p-4 min-h-[300px]">
            <Tabs defaultValue="quests" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="quests">
                  <Scroll className="w-4 h-4 mr-2" />
                  任务
                </TabsTrigger>
                <TabsTrigger value="adventure">
                  <Compass className="w-4 h-4 mr-2" />
                  奇遇
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quests" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[250px]">
                  <div className="space-y-3">
                    {quests.map(quest => (
                      <Card
                        key={quest.id}
                        className={`p-3 ${
                          quest.status === 'completed'
                            ? 'border-green-500/30 bg-green-500/5'
                            : quest.status === 'claimed'
                            ? 'border-slate-700 bg-slate-800/30 opacity-50'
                            : 'border-blue-500/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold text-slate-200">{quest.name}</div>
                            <div className="text-sm text-slate-400">{quest.description}</div>
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
                                ? 'bg-green-600'
                                : quest.status === 'claimed'
                                ? ''
                                : 'border-blue-500 text-blue-400'
                            }
                          >
                            {quest.status === 'completed'
                              ? '可领取'
                              : quest.status === 'claimed'
                              ? '已完成'
                              : '进行中'}
                          </Badge>
                        </div>
                        <Progress value={(quest.progress / quest.goal) * 100} className="h-2 mb-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">
                            {quest.progress}/{quest.goal}
                          </span>
                          {quest.status === 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => claimQuestReward(quest.id)}
                              className="bg-green-600 hover:bg-green-700"
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
                  <Compass className="w-16 h-16 text-amber-400 mb-4" />
                  <p className="text-slate-400 mb-4">修仙路上充满奇遇</p>
                  <Button onClick={triggerAdventure} className="bg-amber-600 hover:bg-amber-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    探索奇遇
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* 奇遇弹窗 */}
      {showAdventure && currentAdventure && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-slate-900 border-amber-500/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="w-8 h-8 text-amber-400" />
                <h3 className="text-2xl font-bold text-amber-400">{currentAdventure.title}</h3>
              </div>
              <p className="text-slate-400 mb-3">{currentAdventure.description}</p>
              <Card className="p-4 bg-slate-800/50 border-slate-700 mb-6">
                <p className="text-slate-300">{currentAdventure.content}</p>
              </Card>
              <div className="space-y-2">
                {currentAdventure.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => handleAdventureOption(currentAdventure, option.id)}
                    variant={option.id === 1 ? 'default' : 'outline'}
                    className={`w-full ${
                      option.id === 1
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'border-slate-600 text-slate-300 hover:bg-slate-800'
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
                className="w-full mt-4 text-slate-400 hover:text-slate-300"
              >
                离开
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
