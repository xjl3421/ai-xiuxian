  // ==================== 渲戏结束总结界面（新增） ====================

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

                  <Card className="p-4 bg-muted/30 border border-border/30">
                    <div className="text-sm text-muted-foreground mb-1">职业</div>
                    <div className="font-medium text-foreground">
                      {PROFESSIONS[gameSummary.profession].name}
                    </div>
                  </Card>
                </div>

                {/* 统计数据 */}
                <Card className="p-5 bg-muted/30 border border-border/30">
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
                      onClick={restartGame}
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
  }

  // ==================== 主游戏界面（修改通知渲染部分） ====================

  return (
    <div className="min-h-screen bg-background flex flex flex-col">
      {/* ==================== 修改部分 5: 通知系统（支持堆叠和删除） ==================== */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm max-h-[calc(100vh-100px)]">
        {notifications.map((notif, index) => (
          <Card
            key={notif.id}
            className={`
              relative p-4 bg-card/95 backdrop-blur-sm border border-primary/30 shadow-lg transition-all duration-200 ${
                notif.dismissed ? 'hover:shadow-accent' : 'opacity-50'
              } ${index === 0 ? 'opacity-100' : 'opacity-0'}
            `}
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
      </div>
      {/* ... 其余界面保持不变 ... */}
    </div>
  )
}

export default XianXianGame()
