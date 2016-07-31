import vector from './utils/vector'
import {
  fromContainerToDocument,
  fromContainerToWorld,
  fromWorldToContainer,
  fromWorldToDocument,
} from './transformations'

/// Various centers
export const center_world = (state) => vector.scale(1 / 2, state.worldSize)
export const centerWorld_document = (state) => fromWorldToDocument(state, center_world(state))
export const centerWorld_container = (state) => fromWorldToContainer(state, center_world(state))
export const center_container = (state) => vector.scale(1 / 2, state.containerSize)

export const centerContainer_document = (state) => (
  fromContainerToDocument(state, center_container(state))
)

export const centerContainer_world = (state) => (
  fromContainerToWorld(state, center_container(state))
)
