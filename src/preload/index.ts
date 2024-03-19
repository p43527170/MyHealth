import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
console.log(electronAPI)

// // 获取窗口的宽高
// const windowSize = currentWindow.getSize();
// const width = windowSize[0];
// const height = windowSize[1];

// console.log(`Window Width: ${width}px, Window Height: ${height}px`);

// const contentSize = currentWindow.getContentSize();
// const contentWidth = contentSize[0];
// const contentHeight = contentSize[1];

// console.log(`Window Content Width: ${contentWidth}px, Window Content Height: ${contentHeight}px`);
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    //contextBridge.exposeInMainWorld通信最小化方法
    contextBridge.exposeInMainWorld('electronApi', {
      minimize: () => {
        ipcRenderer.send('minimize');
      },
      close: () => {
        ipcRenderer.send('close');
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
