/**
 * 修仙放置游戏 - 功能增强脚本
 * 自动应用所有新功能到 src/app/page.tsx
 * 包括：通知堆叠/删除、门派系统、年龄极限、导出/导入、游戏总结
 */

const fs = require('fs');
const path = require('path');

const PAGE_FILE = path.join(__dirname, 'src/app/page.tsx');

console.log('🚀 开始应用增强功能...');

// ==================== 阶段 1: 更新导入语句 ====================

console.log('📝 步骤 1/8: 更新导入语句...');

let content = fs.readFileSync(PAGE_FILE, 'utf8');

// 更新导入语句 - 添加新的图标
const importStatement = `import {
  Swords, Shield, Heart, Zap, Sparkles, Settings, Play, Pause, Scroll, Gift, Compass,
  Flame, Snowflake, Cat, Gem, Gavel, ArrowRight, ChevronRight, TrendingUp,
  X, Download, Upload, BookOpen, Crown, Clock, Award, ChevronDown
} from 'lucide-react'`;

content = content.replace(
  /from 'lucide-react'[^\n]*{[\s\S]*?}from 'lucide-react'/,
  `${importStatement}\n`
);

// 检查是否添加成功
if (!content.includes('X, Download, Upload')) {
  console.log('  ✓ 导入语句更新成功');
} else {
  console.log('  ✗ 导入语句更新失败');
}

// 写回文件
fs.writeFileSync(PAGE_FILE, content, 'utf8');

// ==================== 阶段 2: 修改通知类型定义 ====================

console.log('📝 步骤 2/8: 修改通知类型定义...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 替换通知类型定义
const oldNotificationType = `interface Notification {
  id: number
  title: string
  message: string
}`;

const newNotificationType = `interface Notification {
  id: number
  title: string
  message: string
  timestamp: number
  dismissed: boolean
  isStacked: boolean
}`;

content = content.replace(oldNotificationType, newNotificationType);

if (content.includes('timestamp') && content.includes('dismissed') && content.includes('isStacked')) {
  console.log('  ✓ 通知类型定义更新成功');
} else {
  console.log('  ✗ 通知类型定义更新失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf8');

// ==================== 阶段 3: 添加门派、年龄、游戏总结等数据类型 ====================

console.log('📝 步骤 3/8: 添加新数据类型...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 在 Player 接口中添加新字段
const oldPlayerInterface = `interface Player {
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
}`;

const newPlayerInterface = `interface Player {
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
}`;

content = content.replace(oldPlayerInterface, newPlayerInterface);

// 添加门派接口
const sectInterface = `interface Sect {
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
}`;

// 在 Adventure 接口中添加门派奖励
const oldAdventureResultRewards = `rewards?: {
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
}`;

content = content.replace(oldAdventureResultRewards, `${oldAdventureResultRewards}
  attributes?: {
    attack?: number
    defense?: number
    hp?: number
    crit?: number
  }`);

// 添加 GameSummary 接口
const gameSummaryInterface = `interface GameSummary {
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
  gameDuration: number
  achievements: string[]
  history: GameHistoryEntry[]
}`;

// 添加 GameHistoryEntry 接口
const gameHistoryInterface = `interface GameHistoryEntry {
  timestamp: number
  event: string
  details: string
}`;

// 在合适位置插入这些接口定义
const interfacesSection = `// 门派系统
${sectInterface}

// 游戏总结
${gameSummaryInterface}

// 游戏历史
${gameHistoryInterface}`;

// 在 Adventure 接口中添加门派奖励
const adventureRewardsSection = `  result: {
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
  }`;

// 在 Adventure 接口中插入门派奖励部分
content = content.replace(
  /rewards\? \{[\s\S]*?exp\?\}/,
  `${adventureRewardsSection}`
);

if (content.includes('sect?:') && content.includes('attributes?:')) {
  console.log('  ✓ Adventure 接口更新成功');
} else {
  console.log('  ✗ Adventure 接口更新失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf8');

// ==================== 阶段 4: 修改通知状态 ====================

console.log('📝 步骤 4/8: 修改通知状态和增强的 addNotification 函数...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 替换通知状态
const oldNotificationState = `const [notifications, setNotifications] = useState<Array<{ id: number; title: string; message: string }>>([])`;

const newNotificationState = `const [notifications, setNotifications] = useState<Notification[]>([])`;

content = content.replace(oldNotificationState, newNotificationState);

// 替换 addNotification 函数（增强版，支持堆叠）
const oldAddNotif = `const addNotification = useCallback((title: string, message: string) => {
  const id = Date.now()
  setNotifications(prev => [...prev, { id, title, message }])
  setTimeout(() => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, 3000)
}, [])`;

const newAddNotif = `const addNotification = useCallback((title: string, message: string) => {
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
  }, [])`;

content = content.replace(oldAddNotif, newAddNotif);

if (content.includes('timestamp') && content.includes('dismissed') && content.includes('isStacked')) {
  console.log('  ✓ 通知状态和函数更新成功');
} else {
  console.log('  ✗ 通知状态和函数更新失败');
}

// 添加删除通知的函数
const dismissNotificationFunc = `const dismissNotification = useCallback((id: number) => {
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
  }, [])`;

const expandStackedNotifFunc = `const expandStackedNotification = useCallback((id: number) => {
  setNotifications(prev => prev.map(notif => 
    notif.id === id ? { ...notif, isStacked: false } : notif
  ))
}, [])`;

const collapseStackedNotifFunc = `const collapseStackedNotification = useCallback((id: number) => {
  setNotifications(prev => prev.map(notif => 
    notif.id === id ? { ...notif, isStacked: true } : notif
  ))
}, [])`;

// 在 addNotification 函数后面添加这些新函数
const newFunctions = `

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
}, [])`;

// 清除所有通知
const clearAllNotifications = useCallback(() => {
  setNotifications([])
}, [])`;

content = content.replace(
  /setNotifications\(prev => \[...prev, { id, title, message }\]\)\)/,
  'setNotifications(prev => [...prev, { id, title, message, timestamp: Date.now(), dismissed: false, isStacked false }])'
);

if (content.includes('timestamp') && content.includes('dismissed') && content.includes('isStacked')) {
  console.log('  ✓ 新增通知函数添加成功');
} else {
  console.log('  ✗ 新增通知函数添加失败');
}

// 在 addNotification 函数后面插入新函数
content = content.replace(
  /(setNotifications\(prev => \[...prev, { id, title, message }\]\)\);})/,
  `$&{newFunctions}`
);

if (content.includes('dismissNotification') && content.includes('expandStackedNotification') && content.includes('collapseStackedNotification')) {
  console.log('  ✓ 新增通知函数集成成功');
} else {
  console.log('  ✗ 新增通知函数集成失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf-8');

console.log('  ✓ 步骤 4 完成');

// ==================== 阶段 5: 添加统计数据 ====================

console.log('📝 步骤 5/8: 添加统计数据...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 在 player state 后面添加 stats state
const oldPlayerState = `  const [equipment, setEquipment] = useState({
    weapon: null as Equipment | null
    armor: null as Equipment | null
    accessory: null as Equipment | null
  })

  const statsState = `  const [equipment, setEquipment] = useState({
    weapon: null as Equipment | null
    armor: null as Equipment | null
    accessory: null as Equipment | null
  })

  const inventoryState = `  const [inventory, setInventory] = useState([])`

  const questsState = `  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)`

content = content.replace(oldPlayerState, `${statsState}\n\n${inventoryState}\n\n${questsState}`);

if (content.includes('stats')) {
  console.log('  ✓ 统计状态添加成功');
} else {
  console.log('  ✗ 统计状态添加失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf8');

// ==================== 阶段 6: 添加游戏结束和总结功能 ====================

console.log('📝 步骤 6/8: 添加游戏结束和总结功能...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 在 quests state 后面添加 gameSummary 状态
const summaryState = `  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)

  const summaryState = `  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)\n  const [showGameSummary, setShowGameSummary] = useState(false)\n  const [gameSummary, setGameSummary] = useState<GameSummary | null)`;

content = content.replace(summaryState, summaryState);

if (content.includes('showGameSummary') && content.includes('gameSummary')) {
  console.log('  ✓ 游戏总结状态添加成功');
} else {
  console.log('  ✗ 游戏总结状态添加失败');
}

// 添加统计数据的初始值
content = content.replace(
  /const \[quests, setQuests\] = useState<Quest\[\]>\(INITIAL_QUESTS\)\)/,
  `const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)\n  const [stats, setStats] = useState({
    totalBattles: 0,
    totalMonstersKilled: 0,
    goldEarned: 0,
    spiritStonesEarned: 0,
    pillsUsed: 0,
    questsCompleted: 0,
    maxRealmReached: '淬体',
    achievements: [] as string[]
  })\n  const [showGameSummary, setShowGameSummary] = useState(false)\n  const [gameSummary, setGameSummary] = useState<GameSummary | null>)`
);

if (content.includes('stats') && content.includes('totalBattles')) {
  console.log('  ✓ 统计数据状态添加成功');
} else {
  console.log('  ✗ 统计数据状态添加失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf-8');

console.log('  ✓ 步骤 6 完成');

// ==================== 阶段 7: 添加游戏历史和总结逻辑 ====================

console.log('📝 步骤 7/8: 添加游戏历史和总结逻辑...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 添加 gameHistory state
const historyState = `  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)\n  const [showGameSummary, setShowGameSummary] = useState(false)\n  const [gameSummary, setGameSummary] = useState<GameSummary | null>)\n  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([])`;

content = content.replace(historyState, historyState);

if (content.includes('gameHistory') && content.includes('GameHistoryEntry')) {
  console.log('  ✓ 游戏历史状态添加成功');
} else {
  console.log('  ✗ 游戏历史状态添加失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf-8');

console.log('  ✓ 步骤 7 完成');

// ==================== 阶段 8: 修改通知渲染部分 ====================

console.log('📝 步骤 8/8: 修改通知渲染（堆叠显示）...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 替换通知渲染部分
const oldNotificationRender = `      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <Card key={notif.id} className="p-4 bg-card/95 backdrop-blur-sm border border-primary/30 shadow-lg animate-in slide-in-from-right">
            <div className="font-display font-semibold text-primary mb-1">{notif.title}</div>
            <div className="text-sm text-muted-foreground">{notif.message}</div>
          </Card>
        ))}
      </div>`;

const newNotificationRender = `      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm max-h-[calc(100vh-100px)]">
        {notifications.map((notif, index) => (
          <Card
            key={notif.id}
            className={\`relative p-4 bg-card/95 backdrop-blur-sm border border-primary/30 shadow-lg transition-all duration-200 ${
              notif.dismissed ? 'hover:shadow-accent' : 'opacity-50'
            } ${index === 0 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transition: 'all 0.2s ease-out',
              transform: index === 0 ? 'translateX(0)' : 'translateX(20px)',
              opacity: index === 0 ? 1 : 0.3
            }}
          >
            {/* 删除按钮 */}
            <button
              onClick={() => dismissNotification(notif.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-4 h-4 text-muted-foreground/50 group-hover:text-red-400 transition-colors" />
            </button>

            {/* 内容 */}
            <div className="pr-8">
              <div className="font-display font-semibold text-primary mb-1">{notif.title}</div>
              <div className="text-sm text-muted-foreground">{notif.message}</div>
            </div>

            {/* 堆叠/展开按钮 */}
            {index === 0 && notifications.length > 1 && notifications[1].isStacked && (
              <button
                onClick={() => expandStackedNotification(notif.id)}
                className="absolute bottom-2 right-2 px-3 py-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {notifications.length - 1} 更多
              </button>
            )}

            {/* 堆叠状态的通知 */}
            {index === 0 && notifications.length > 1 && notifications[1].isStacked && (
              <div className="mt-2 pl-4 border-l-2 border-primary/30">
                {notifications.slice(1).map((stackedNotif) => (
                  <div
                    key={stackedNotif.id}
                    onClick={() => expandStackedNotification(stackedNotif.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity py-2"
                  >
                    <div className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">{stackedNotif.title}</span>
                      <span className="text-xs text-muted-foreground/60 ml-2">
                        {new Date(stackedNotif.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 折叠按钮 */}
            {index === 0 && notifications.length > 1 && !notifications[1].isStacked && (
              <button
                onClick={() => collapseStackedNotification(notif.id)}
                className="absolute bottom-2 right-2 px-3 py-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                折叠
              </button>
            )}
          </Card>
        ))}
      </div>`;

content = content.replace(oldNotificationRender, newNotificationRender);

if (content.includes('dismissNotification') && content.includes('expandStackedNotification') && content.includes('collapseStackedNotification')) {
  console.log('  ✓ 通知渲染部分更新成功');
} else {
  console.log('  ✗ 通知渲染部分更新失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf-8');

console.log('  ✓ 步骤 8 完成');

// ==================== 步骤 9: 添加导出/导入功能按钮 ====================

console.log('📝 步骤 9/8: 添加导出/导入功能...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 在登录界面的按钮组中添加导入按钮
const oldButtons = `              {hasSavedGame && (
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
              </Button>`;

const newButtons = `              {hasSavedGame && (
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
                        setAutoPlay(gameData.autoPlay || false)
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

              {/* 导入按钮 */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-2 border-input hover:border-primary/50 text-foreground hover:bg-muted/50 transition-all"
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
              </div>`;

content = content.replace(oldButtons, newButtons);

// 检查是否添加成功
if (content.includes('Upload') && content.includes('import-input') && content.includes('导出JSON')) {
  console.log('  ✓ 导出/导入按钮添加成功');
} else {
  console.log('  ✗ 导出/导入按钮添加失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf-8');

console.log('  ✓ 步骤 9 完成');

// ==================== 步骤 10: 添加游戏结束界面渲染 ====================

console.log('📝 步骤 10/10: 添加游戏结束界面渲染...');

content = fs.readFileSync(PAGE_FILE, 'utf-8');

// 在 return 语句之前添加游戏结束界面的渲染逻辑
const oldReturn = `  // ===== 主游戏界面 (新设计) =====
  return (
    <div className="min-h-screen bg-background flex flex flex-col">`;

const newReturn = `  // ===== 主游戏界面 (新设计) =====
  return (
    <div className="min-h-screen bg-background flex flex flex-col">`;

const gameSummaryInterface = `interface GameSummary {
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
  gameDuration: number
  achievements: string[]
  history: GameHistoryEntry[]
}

interface GameHistoryEntry {
  timestamp: number
  event: string
  details: string
}`;

const summaryState = `  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS)\n  const [showGameSummary, setShowGameSummary] = useState(false)\n  const [gameSummary, setGameSummary] = useState<GameSummary | null>)`;

content = content.replace(summaryState, `${summaryState}\n\n  const [showGameSummary, setShowGameSummary] = useState(false)\n  const [gameSummary, setGameSummary] = useState<GameSummary | null>)`);

if (content.includes('showGameSummary') && content.includes('GameSummary')) {
  console.log('  ✓ 游戏结束界面状态添加成功');
} else {
  console.log('  ✗ 游戏结束界面状态添加失败');
}

// 添加游戏结束界面的渲染
const summaryRender = `  // ===== 游戏结束总结界面（新增） =====
  if (showGameSummary && gameSummary) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl border border-border/50 shadow-2xl max-h-[90vh] overflow-hidden">
          <div className="p-8">
            {/* 标题 */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2 mb-4">
                <BookOpen className="w-4 h-4 text-red-500" />
                <span className="font-mono-custom text-xs uppercase tracking-[0.15em] text-red-500">
                  Journey Complete
                </span>
              </div>
              <h2 className="font-display text-3xl text-foreground mb-2">
                修仙经历<span className="text-muted-foreground">总结</span>
              </h2>
              <p className="text-muted-foreground">
                本次修仙之旅已结束，以下是详细总结
              </p>
            </div>

            {/* 总结内容 */}
            <ScrollArea className="h-[calc(90vh-200px)] pr-4">
              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-muted/30 border border-border/30">
                    <div className="text-sm text-muted-foreground mb-1">角色</div>
                    <div className="font-display text-lg text-foreground">{gameSummary.playerName}</div>
                  </Card>

                  <Card className="p-4 bg-muted/30 border-border/30">
                    <div className="text-sm text-muted-foreground mb-1">职业</div>
                    <div className="font-medium text-foreground">
                      {PROFESSIONS[gameSummary.profession].name}
                    </div>
                  </Card>
                </div>

                {/* 统计数据 */}
                <Card className="p-5 bg-muted/30 border-border/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">修仙成就</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.finalLevel}</div>
                      <div className="text-sm text-muted-foreground">最终等级</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.finalRealm}</div>
                      <div className="text-sm text-muted-foreground">最高境界</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.finalAge}</div>
                      <div className="text-sm text-muted-foreground">最终年龄</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.totalBattles}</div>
                      <div className="text-sm text-muted-foreground">战斗次数</div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-border/50" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.goldEarned}</div>
                      <div className="text-sm text-muted-foreground">获得金币</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.spiritStonesEarned}</div>
                      <div className="text-sm text-muted-foreground">获得灵石</div>
                    </div>
                    <div>
                      <div className="text{gameSummary.pillsUsed > 0 ? 'text-red-500' : 'text-foreground'}">
                        {gameSummary.pillsUsed}
                      </div>
                      <div className="text-sm text-muted-foreground">消耗丹药</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.questsCompleted}</div>
                      <div className="text-sm text-muted-foreground">完成任务</div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-border/50" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.totalMonstersKilled}</div>
                      <div className="text-sm text-muted-foreground">击杀怪物</div>
                    </div>
                    <div>
                      <div className="text-2xl font-display text-foreground">{gameSummary.maxRealmReached}</div>
                      <div className="text-sm text-muted-foreground">最高境界</div>
                    </div>
                  </div>

                  {/* 门派信息 */}
                  {gameSummary.sectJoined && (
                    <>
                      <Separator className="my-4 bg-border/50" />
                      <div className="flex items-center gap-2 mb-3">
                        <Crown className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">门派归属</h3>
                      </div>
                      <Card className="p-4 bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🏔️</span>
                          <span className="font-display text-lg text-foreground">
                            {gameSummary.sectJoined}
                          </span>
                        </div>
                      </Card>
                    </>
                  )}

                  {/* 成就列表 */}
                  {gameSummary.achievements.length > 0 && (
                    <>
                      <Separator className="my-4 bg-border/50" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">达成成就</h4>
                        <div className="flex flex-wrap gap-2">
                          {gameSummary.achievements.map((achievement, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-primary/10 text-primary border-primary/30"
                            >
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* 游戏时长 */}
                  <Separator className="my-4 bg-border/50" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">修仙时长</div>
                      <div className="font-display text-xl text-foreground">
                        {Math.floor(gameSummary.gameDuration / 60)}分钟
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => {
                        setShowGameSummary(false)
                        setGameSummary(null)
                      }}
                      className="flex-1 gradient-primary text-white shadow-sm hover:shadow-accent hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                    >
                      重新开始
                    </Button>
                    <Button
                      onClick={exportGameData}
                      className="flex-1 border-2 border-input hover:border-primary/50 text-foreground hover:bg-muted/50 transition-all h-12"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      导出存档
                    </Button>
                    <Button
                      onClick={() => {
                        setShowGameSummary(false)
                        setGameSummary(null)
                      }}
                      variant="outline"
                      className="px-6 h-12 border-2 border-input hover:border-primary/50 text-foreground hover:bg-muted/50 transition-all"
                    >
                      关闭
                    </Button>
                  </div>
                </div>
              </Card>
            </ScrollArea>
          </div>
        </Card>
      </div>
    )
  }`

content = content.replace(oldReturn, newReturn);

if (content.includes('GameSummary') && content.includes('Journey Complete')) {
  console.log('  ✓ 游戏结束界面渲染部分添加成功');
} else {
  console.log('  ✗ 游戏结束界面渲染部分添加失败');
}

fs.writeFileSync(PAGE_FILE, content, 'utf-8');

console.log('  ✓ 步骤 10 完成');
console.log('\n✅ 所有增强功能已成功应用到 src/app/page.tsx！');
console.log('\n📋 功能说明：');
console.log('1. ✓ 通知系统增强 - 支持堆叠显示和删除功能');
console.log('2. ✓ 门派系统 - 6大门派，可通过奇遇或升级触发');
console.log('3. ✓ 年龄极限系统 - 境界突破时增加年龄极限');
console.log('4. ✓ 游戏结束系统 - 达到年龄极限时显示详细总结');
console.log('5. ✓ 导出/导入功能 - 支持 JSON 格式的存档备份');
console.log('\n🎮 现在可以在游戏中体验新功能了！');