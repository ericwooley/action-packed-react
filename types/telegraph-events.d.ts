declare module 'telegraph-events' {
  export interface Emitter<T> {
    on: (channel: T, listener: (data: any) => any) => Emitter<T>
    once: (channel: T, listener: (data: any) => any) => Emitter<T>
    off: (channel: T, listener: (data: any) => any) => Emitter<T>
    emit: (channel: T, data: any) => any
  }
  export = function telegraph<T>(): Emitter<T>

  // export telegraph
}
