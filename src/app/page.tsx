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
  Download,
  Upload,
  MoreVertical,
  X
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
          message: '你成功加入了青云门，获得了门派的庇护和资源！',
          rewards: { sect: '青云门', exp: 150, gold: 200, lifespan: 30 }
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
    id: 6,
    title: '天剑宗招徒',
    description: '遇到天剑宗长老',
    content: '一位天剑宗的长老看出你资质不凡，邀请你加入天剑宗。天剑宗是修仙界的顶级门派之一。',
    options: [
      {
        id: 1,
        text: '加入天剑宗',
        result: {
          success: true,
          message: '你成功加入了天剑宗，获得了强大的剑法传承！',
          rewards: { sect: '天剑宗', exp: 300, gold: 500, lifespan: 50, attributes: { attack: 10, defense: 5 } }
        }
      },
      {
        id: 2,
        text: '婉拒',
        result: {
          success: false,
          message: '你婉拒了长老的邀请，继续你的修行之路。'
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
    weapon: null,
    armor: null,
    accessory: null
  })

  const [inventory, setInventory] = useState([])

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
  const [showSectJoinDialog, setShowSectJoinDialog] = useState(false)
  const [showGameOverDialog, setShowGameOverDialog] = useState(false)
  const [gameOverSummary, setGameOverSummary] = useState<string>('')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

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
    }, 5000)
  }, [])

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (showSettingsMenu && !target.closest('.settings-menu-container')) {
        setShowSettingsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettingsMenu])

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

  const exportGame = useCallback(() => {
    if (!gameStarted) return
    const gameData = {
      player,
      resources,
      equipment,
      inventory,
      quests,
      autoPlay,
      exportTime: new Date().toISOString()
    }
    const dataStr = JSON.stringify(gameData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `xianxian-${player.name}-${player.realm}-${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    addNotification('导出成功', '修仙经历已导出')
  }, [gameStarted, player, resources, equipment, inventory, quests, autoPlay, addNotification])

  const importGame = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const gameData = JSON.parse(event.target?.result as string)
          setPlayer(gameData.player)
          setResources(gameData.resources)
          setEquipment(gameData.equipment || { weapon: null, armor: null, accessory: null })
          setInventory(gameData.inventory || [])
          setQuests(gameData.quests || INITIAL_QUESTS)
          setAutoPlay(gameData.autoPlay || false)
          setGameStarted(true)
          addNotification('导入成功', '修仙经历已导入')
        } catch (error) {
          addNotification('导入失败', '文件格式错误')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [addNotification])

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
        const newAge = prev.age + 1

        updateQuestProgress('monster_kill', currentEnemy.name, 1)
        updateQuestProgress('resource_collect', 'gold', 0)

        // 检查是否达到寿命极限
        if (newAge >= prev.lifespan) {
          setTimeout(() => {
            const summary = `
修仙生涯总结：
道号：${prev.name}
职业：${PROFESSIONS[prev.profession].name}
体质：${TALENTS[prev.talent].name}
最终等级：${newLevel}
最终境界：${prev.realm}
寿龄：${newAge}年
门派：${prev.sect || '散修'}
灵兽：${prev.pet || '无'}
击杀怪物：无数
收获金币：${resourcesRef.current.gold}
收集灵石：${resourcesRef.current.spiritStone}
炼制丹药：${resourcesRef.current.pills}

虽然未能飞升，但你的一生也算精彩纷呈！
            `.trim()
            setGameOverSummary(summary)
            setShowGameOverDialog(true)
            setAutoPlay(false)
          }, 1000)
        }

        return {
          ...prev,
          exp: newExp,
          level: newLevel,
          age: newAge,
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
        const lifespanIncrease = 50 + (newRealmIndex * 20) // 每个境界增加更多寿命
        setPlayer(prev => ({
          ...prev,
          realm: REALMS[newRealmIndex],
          lifespan: prev.lifespan + lifespanIncrease,
          attributes: {
            ...prev.attributes,
            attack: prev.attributes.attack + 5,
            defense: prev.attributes.defense + 3,
            maxHp: prev.attributes.maxHp + 50,
            hp: prev.attributes.hp + 50
          }
        }))
        updateQuestProgress('realm_reach', REALMS[newRealmIndex], 1)
        addNotificationRef.current('境界突破', `恭喜！你突破到了${REALMS[newRealmIndex]}境！寿命增加${lifespanIncrease}年！`)
        
        // 如果没有门派，显示加入门派选项
        if (!currentPlayer.sect) {
          setTimeout(() => setShowSectJoinDialog(true), 1000)
        }
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
    }

    setShowAdventure(false)
    setCurrentAdventure(null)
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
                onClick={importGame}
                variant="outline"
                className="w-full h-12 border-2 border-input hover:border-primary/50 font-semibold group transition-all duration-200"
              >
                <Upload className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                导入经历
              </Button>

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
        {notifications.map((notif, index) => (
          <Card 
            key={notif.id} 
            className={`p-4 bg-card/95 backdrop-blur-sm border border-primary/30 shadow-lg animate-in slide-in-from-right relative transition-all ${
              index > 0 ? 'scale-95 opacity-70' : ''
            }`}
            style={{
              transform: index > 0 ? `translateY(${-8 * index}px) scale(${1 - index * 0.05})` : 'none',
              zIndex: 50 - index
            }}
          >
            <button
              onClick={() => removeNotification(notif.id)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
            <div className="font-display font-semibold text-primary mb-1">{notif.title}</div>
            <div className="text-sm text-muted-foreground pr-4">{notif.message}</div>
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

            <div className="relative settings-menu-container">
              <Button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                variant="ghost"
                size="sm"
                className="h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-lg z-50 overflow-hidden settings-menu-container">
                  <button
                    onClick={() => {
                      exportGame()
                      setShowSettingsMenu(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    导出经历
                  </button>
                  <button
                    onClick={() => {
                      importGame()
                      setShowSettingsMenu(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    导入经历
                  </button>
                  <Separator className="bg-border/50" />
                  <button
                    onClick={() => {
                      resetGame()
                      setShowSettingsMenu(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    重新开始
                  </button>
                </div>
              )}
            </div>
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

      {/* 门派加入弹窗 */}
      {showSectJoinDialog && !player.sect && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-card border border-border/50 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-2xl text-foreground">境界突破机缘</h3>
              </div>

              <Card className="p-5 bg-muted/30 border border-border/30 mb-6">
                <p className="text-foreground/90 leading-relaxed mb-4">
                  恭喜你突破到{player.realm}境！修仙路上孤身一人太过艰难，是否考虑加入门派获得庇护？
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• 获得门派传承和资源</p>
                  <p>• 增加寿命上限</p>
                  <p>• 提升修炼速度</p>
                </div>
              </Card>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    const sects = ['青云门', '天剑宗', '万法宗', '太玄派', '昆仑派']
                    const randomSect = sects[Math.floor(Math.random() * sects.length)]
                    setPlayer(prev => ({
                      ...prev,
                      sect: randomSect,
                      lifespan: prev.lifespan + 30
                    }))
                    setResources(prev => ({
                      ...prev,
                      gold: prev.gold + 300,
                      spiritStone: prev.spiritStone + 20,
                      pills: prev.pills + 10
                    }))
                    addNotification('加入门派', `成功加入${randomSect}！获得大量资源！`)
                    setShowSectJoinDialog(false)
                  }}
                  className="w-full h-12 gradient-primary text-white shadow-sm hover:shadow-accent transition-all duration-200"
                >
                  加入门派
                </Button>
                <Button
                  onClick={() => setShowSectJoinDialog(false)}
                  variant="outline"
                  className="w-full h-12 border-2 border-input hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                >
                  继续散修
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 游戏结束弹窗 */}
      {showGameOverDialog && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-card border border-border/50 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">修仙生涯结束</h3>
                </div>
                <button
                  onClick={() => setShowGameOverDialog(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Card className="p-6 bg-muted/30 border border-border/30 mb-6">
                <pre className="text-foreground/90 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {gameOverSummary}
                </pre>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={exportGame}
                  variant="outline"
                  className="h-12 border-2 border-input hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  导出经历
                </Button>
                <Button
                  onClick={() => {
                    setShowGameOverDialog(false)
                    resetGame()
                  }}
                  className="h-12 gradient-primary text-white shadow-sm hover:shadow-accent transition-all duration-200"
                >
                  重新开始
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
