export interface Store {
  startAudio?: any,
  completeAudio?: any,
  doesLastRunPass: boolean,
  reset(): void
}

export const store: Store = {
  doesLastRunPass: false,
  reset() {
    store.completeAudio = undefined,
    store.doesLastRunPass = false,
    store.startAudio = undefined
  }
}
