[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ymsjl/afeedrss)
这是一个 [Next.js](https://nextjs.org/) 项目，由 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 引导创建。

## 开始使用

### 运行开发服务器
```bash
npm run dev
# 或
yarn dev
# 使用 mock 数据运行开发服务器
npm run dev:mock
# 或
yarn dev:mock
# 构建带有 mock 数据的生产版本
npm run build:mock
# 或
yarn build:mock
```
打开 [http://localhost:3000](http://localhost:3000) 即可在浏览器中查看效果。  
你可以开始编辑 `pages/index.tsx` 来修改页面，页面在编辑时会自动更新。  
[API 路由](https://nextjs.org/docs/api-routes/introduction) 可通过 [http://localhost:3000/api/hello](http://localhost:3000/api/hello) 访问，修改 `pages/api/hello.ts` 以更新此端点。

## 环境变量
在 `.env.local` 文件中配置：  
- `CLIENT_ID`  
- `CLIENT_SECRET`  
- `REDIRECT_URI`  
- `NEXT_PUBLIC_INOREADER_SERVER_URL`  
- `NEXTAUTH_URL`  
- `NEXTAUTH_SECRET`  

克隆项目后，需要创建或更新 `.env.local` 并填写以上变量的值。

## 技术说明

### Next.js
- 服务端渲染和静态站点生成  
- 配置：`next.config.js`  
- App Router 结构位于 `app/`

### Zustand
- 状态管理  
- 在 `providers/app-store-provider.tsx` 封装全局状态逻辑  
- 通过 `use-store.ts` 提供自定义 Hook

### React Query
- 数据获取、缓存和同步  
- 在 `providers/query-client-provider.tsx` 初始化和提供 QueryClient  
- 在 `features/` 下使用自定义 Hook

### Fluent UI
- 用于构建现代化、响应式 UI  
- 在 `providers/fluent-ssr-provider.tsx` 中封装 SSR 支持  
- 在组件中直接使用相应组件和样式

### NextAuth.js
- 身份验证  
- 在 `api/auth/` 中配置回调和策略  
- 通过 `useSession`、`signIn` 和 `signOut` 管理会话

### MSW（Mock Service Worker）
- 模拟 API 请求  
- 在 `services/mock/` 下配置模拟数据  
- 通过 `dev:mock` 脚本启用模拟服务

此外，项目使用了 `dayjs`、`js-cookie`、`lodash.keyby` 等。

## 项目代码风格

### 文件命名规范
- 采用小写字母加中划线（kebab-case）命名文件和文件夹，例如：`article-list-settings-modal.tsx`。
- 组件文件夹下的主入口文件统一为 `index.tsx`，样式文件为 `xxx.style.ts(x)`。
- 类型定义文件统一以 `.types.ts` 结尾，工具函数统一放在 `utils/` 目录。

### 时间处理
- 全局统一使用 `dayjs` 进行时间格式化、解析和展示。
- 不直接操作原生 `Date`，所有时间相关逻辑均通过 `utils/dayjs.ts` 封装。
- 展示相对时间时统一用 `dayjs().fromNow()`。

### 数据获取
- 统一使用 React Query 进行数据请求、缓存和同步。
- 数据请求逻辑封装在 `features/` 或 `services/` 下，推荐使用 `useXXXQuery`、`useXXXMutation` 命名。
- 所有请求都应有 loading、error、empty 三种状态处理。

### 状态管理
- 组件内部状态：使用 React 的 `useState`、`useReducer`，仅限于组件自身逻辑。
- 页面级状态：可用 React Context 或局部 store，避免全局污染。
- 应用级状态：使用 Zustand，所有全局状态集中在 `store/app-store.ts`，通过 `useAppStore` 访问。
- 跨页面状态同步：通过 Zustand + Next.js Provider 方案，详见 `providers/app-store-provider.tsx`。
- 状态持久化：全局状态持久化到 localStorage/cookie，详见 `store/app-store.ts`，使用 `persist` 中间件。

### 服务端组件与客户端组件组织
- 服务端组件（Server Component）默认放在 `app/` 目录下，文件不加 `"use client"`。
- 需要交互、状态、事件的组件需加 `"use client"`，并放在 `components/` 或 `app/xxx/_components/` 下。
- 复用性强的 UI 组件建议放在 `components/`，页面专用组件放在 `app/xxx/_components/`。
- 服务端组件中不可直接使用浏览器 API、hooks、事件等。

### 组件编写规范
- 组件必须使用函数式组件（Function Component），推荐使用 `React.memo` 包裹。
- 组件 props 必须显式声明类型。
- 样式统一使用 Fluent UI 的 `makeStyles`，样式与组件同名。
- 组件内部尽量无副作用，副作用统一放在 `useEffect/useLayoutEffect`。
- 组件导出时统一使用 `export default` 或 `export const Xxx = React.memo(...)`。
- 组件命名采用大驼峰（PascalCase），props 命名采用小驼峰（camelCase）。
- 组件应有良好的可组合性和可扩展性，避免硬编码。

### 常量使用规范
- 所有全局常量统一放在 `constants/` 目录下，按功能拆分文件，如 `constants/index.ts`、`constants/storageKeys.ts`。
- 命名采用全大写加下划线（SNAKE_CASE），如 `DEFAULT_PAGE_SIZE`、`API_BASE_URL`。
- 不允许在组件或业务逻辑中硬编码常量，必须通过常量文件引用。
- 与服务端接口相关的常量（如枚举、状态码）建议与后端保持同步，必要时在 `types/` 目录下定义类型。
- 仅在本地作用域使用的常量可用 `const` 直接声明于函数或模块顶部。

## 目录结构
```shell
项目根目录/
├── app/                     # App Router 目录
├── api/                     # API 路由目录
├── auth/                    # 身份验证页面
├── providers/               # 全局状态和服务提供者
├── components/              # 通用组件
├── constants/               # 常量定义
├── features/                # 功能模块
├── public/                  # 静态资源目录
├── scripts/                 # 脚本文件
├── services/                # 服务层封装
├── store/                   # 状态管理
├── styles/                  # 样式文件
├── theme/                   # 主题和样式配置
├── types/                   # 类型定义
├── utils/                   # 工具函数
├── Dockerfile
├── next.config.js
├── package.json
└── tsconfig.json
```

### 关键目录的作用和扩展方式
- **app/**：页面和布局文件  
- **providers/**：全局服务和状态管理  
- **components/**：通用组件  
- **features/**：按功能模块划分  
- **services/**：API 调用和业务逻辑  
- **store/**：全局状态  
- **styles/** 和 **theme/**：全局样式和主题配置
