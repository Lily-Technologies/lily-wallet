import createIPCMock from 'electron-mock-ipc';
const mocked = createIPCMock();
const ipcMain = mocked.ipcMain;
const ipcRenderer = mocked.ipcRenderer;
export { ipcMain, ipcRenderer };
// example usage
// import { IpcMainEvent } from 'electron'
// import { ipcMain } from '~/spec/mock/electron-mock'
// import { targetMethod } from '~/src/target'
// describe('your test', () => {
//   it('should be received', async () => {
//     ipcMain.once('/estimate-fee', (event: IpcMainEvent, obj: string) => {
//       event.sender.send('/estimate-fee', 5)
//     })
//     const res = await targetMethod()
//     expect(res).toEqual(5)
//   })
// })
//# sourceMappingURL=electron-mock.js.map