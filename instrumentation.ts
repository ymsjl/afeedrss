export async function register() {
  // 只在开发环境或者特定环境变量下启用mock
  if (process.env.NODE_ENV === 'development' && process.env.ENABLE_MSW === 'true') {
    // 确保这段代码只在服务器端执行
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      (await import('./services/mock/seed-db')).seedDb()
      const { server } = await import('./services/mock/msw-node-server')
      server.listen({ onUnhandledRequest: 'bypass' })
      console.log('[MSW] 服务器端 Mock 已启用')
    }
  }
}