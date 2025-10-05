import { Light } from "./LightingControls";

interface LightRendererProps {
  lights: Light[];
}

export const LightRenderer = ({ lights }: LightRendererProps) => {
  return (
    <>
      {lights.map((light) => {
        const position = light.position as [number, number, number];
        
        if (light.type === "directional") {
          return (
            <directionalLight
              key={light.id}
              position={position}
              color={light.color}
              intensity={light.intensity}
              castShadow
            />
          );
        }
        
        if (light.type === "point") {
          return (
            <pointLight
              key={light.id}
              position={position}
              color={light.color}
              intensity={light.intensity}
              distance={50}
            />
          );
        }
        
        if (light.type === "spot") {
          return (
            <spotLight
              key={light.id}
              position={position}
              color={light.color}
              intensity={light.intensity}
              angle={0.6}
              penumbra={0.5}
              castShadow
            />
          );
        }
        
        return null;
      })}
    </>
  );
};