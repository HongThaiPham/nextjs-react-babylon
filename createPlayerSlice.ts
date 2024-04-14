import { GetState, SetState } from "zustand";
import { AppState } from "./useStore";

import { AbstractMesh, Scene, Engine, Vector3 } from "@babylonjs/core";
import { Nullable } from "@babylonjs/core/types";

export interface IPlayerSlice {
  player: {
    sceneRef: Nullable<Scene> | any;
    modelRef: Nullable<AbstractMesh> | any;
    engineRef: Nullable<Engine> | any;
    cameraLookAt: Vector3;
  };
  animation: {
    frame: number;
    totalFrames: number;
  };
  setCameraLookAt: (position: Vector3) => void;
  setTotalFrames: (totalFrames: number) => void;
  setFrame: (frame: number) => void;
  setSceneRef: (sceneRef: Nullable<Scene>) => void;
  setEngineRef: (sceneRef: Nullable<Engine>) => void;
  setModelRef: (modelRef: Nullable<AbstractMesh>) => void;
}

const defaultEngineRef = null; //new Engine(null);
const defaultSceneRef = null; //new Scene(defaultEngineRef, {});
const defaultModelRef = null; //new AbstractMesh('', defaultSceneRef);
const defaultCameraLookAt = Vector3.Zero();
const defaultStartingFrame = 0;
const defaultTotalFrames = 200;

const createPlayerSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>
): IPlayerSlice => ({
  player: {
    sceneRef: defaultSceneRef,
    engineRef: defaultEngineRef,
    modelRef: defaultModelRef,
    cameraLookAt: defaultCameraLookAt
  },
  animation: {
    frame: defaultStartingFrame,
    totalFrames: defaultTotalFrames
  },
  setSceneRef: (sceneRef) => {
    set((prev: AppState) => ({ player: { ...prev.player, sceneRef } }));
  },
  setEngineRef: (engineRef) => {
    set((prev: AppState) => ({ player: { ...prev.player, engineRef } }));
  },
  setModelRef: (modelRef) => {
    set((prev: AppState) => ({ player: { ...prev.player, modelRef } }));
  },
  setCameraLookAt(position) {
    set((prev: AppState) => ({
      player: { ...prev.player, cameraLookAt: position }
    }));
  },
  setFrame(frame) {
    set((prev: AppState) => ({ animation: { ...prev.animation, frame } }));
  },
  setTotalFrames(totalFrames) {
    set((prev: AppState) => ({
      animation: { ...prev.animation, totalFrames }
    }));
  }
});

export default createPlayerSlice;
