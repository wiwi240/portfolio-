/// <reference types="vite/client" />

declare module '*.glb' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'meshline' {
  export const MeshLineGeometry: unknown
  export const MeshLineMaterial: unknown
}

declare namespace JSX {
  interface IntrinsicElements {
    meshLineGeometry: any
    meshLineMaterial: any
  }
}
