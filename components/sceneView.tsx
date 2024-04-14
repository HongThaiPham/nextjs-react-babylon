import React, { useRef, useState } from "react";
import {
  Scene as babylonScene,
  EngineOptions,
  SceneOptions,
  Vector3,
  Color3,
  Color4,
  GroundMesh
} from "@babylonjs/core";

import { GridMaterial } from "@babylonjs/materials";

import { Engine, Scene } from "react-babylonjs";

import MeshComponent from "./meshComponent";

import useStore from "../useStore";

export type BabylonjsProps = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  renderChildrenWhenReady?: boolean;
  showFps?: boolean;
  sceneOptions?: SceneOptions;
  sceneRef?: babylonScene;
  className?: string;
  children?: React.ReactNode;
};

const SceneView = ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  showFps,
  ...rest
}: BabylonjsProps) => {
  const [fps, setFps] = useState<string>("");
  const setSceneRef = useStore((state) => state.setSceneRef);
  const setEngineRef = useStore((state) => state.setEngineRef);
  const cameraTarget = useStore((state) => state.player.cameraLookAt);
  const groundRef = useRef<GroundMesh>(null);

  function setupGroundGrid() {
    if (!groundRef.current) return;

    console.log("adjusting ground material");
    const groundMaterial = new GridMaterial(
      "groundMaterial",
      groundRef.current._scene
    );
    groundMaterial.minorUnitVisibility = 0.45;
    groundMaterial.majorUnitFrequency = 10;
    groundMaterial.gridRatio = 2;
    groundMaterial.backFaceCulling = false;
    groundMaterial.mainColor = new Color3(1, 1, 1);
    groundMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
    groundMaterial.opacity = 0.1;
    groundRef.current.material = groundMaterial;
  }

  function onSceneMount(sceneArgs: any) {
    console.log("onSceneMount: ", sceneArgs);
    const { scene } = sceneArgs;
    const engine = scene.getEngine();
    if (scene && engine) {
      setSceneRef(scene);
      setEngineRef(engine);
      setTimeout(setupGroundGrid, 500); // this doesn't sync well in dev env
    }
  }

  return (
    <div style={{ flex: 1, display: "flex" }}>
      <Engine
        engineOptions={engineOptions}
        antialias
        adaptToDeviceRatio
        canvasId="render-canvas"
        style={{ height: "100vh" }}
        {...rest}
      >
        <Scene
          onSceneMount={onSceneMount}
          collisionsEnabled={true}
          clearColor={new Color4(0.17, 0.17, 0.17, 1)}
        >
          <arcRotateCamera
            name="arcCamera"
            target={cameraTarget}
            alpha={Math.PI / 2}
            beta={Math.PI / 4}
            radius={10}
            lowerRadiusLimit={2}
            upperRadiusLimit={6}
            wheelPrecision={80}
          />
          <hemisphericLight
            name="hemLight"
            direction={new Vector3(0, -1, 0)}
            intensity={1}
          />
          <directionalLight
            name="shadow-light"
            setDirectionToTarget={[Vector3.Zero()]}
            direction={Vector3.Zero()}
            position={new Vector3(-80, 30, -80)}
            intensity={1}
            shadowMinZ={1}
            shadowMaxZ={2500}
          ></directionalLight>
          <ground
            name="ground"
            width={300}
            height={300}
            ref={groundRef}
            subdivisions={2}
            receiveShadows={true}
          />
          <adtFullscreenUi name="UI">
            {showFps && (
              <textBlock
                key="fpsCounter"
                text={fps}
                width={30}
                height={30}
                color={"orange"}
                fontSize={18}
                top={"-48%"}
                left={"48.5%"}
              />
            )}
          </adtFullscreenUi>
          <MeshComponent position={new Vector3(0, 0, 0)} />
        </Scene>
      </Engine>
    </div>
  );
};

export default SceneView;
