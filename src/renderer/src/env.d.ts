/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

export interface IElectronAPI {
  windowClose: () => Promise<void>
  windowMini: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
