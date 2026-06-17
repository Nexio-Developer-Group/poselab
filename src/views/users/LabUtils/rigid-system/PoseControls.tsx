import * as THREE from 'three';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RigState } from './types';

interface PoseControlsProps {
    pose: { poseConfig: RigState };
    onPoseChange: (partName: string, axis: 'x' | 'y' | 'z', valueDeg: number) => void;
}

// Groups define render order and visual color coding
const PART_GROUPS: { label: string; color: string; keys: string[] }[] = [
    {
        label: "Head",
        color: "text-yellow-400",
        keys: ["head"],
    },
    {
        label: "Body",
        color: "text-orange-400",
        keys: ["body"],
    },
    {
        label: "Arms",
        color: "text-blue-400",
        keys: ["leftArm", "rightArm", "leftUpperArm", "leftLowerArm", "rightUpperArm", "rightLowerArm"],
    },
    {
        label: "Legs",
        color: "text-green-400",
        keys: ["leftLeg", "rightLeg", "leftUpperLeg", "leftLowerLeg", "rightUpperLeg", "rightLowerLeg"],
    },
];

const PART_LABELS: Record<string, string> = {
    head: "Head",
    body: "Body",
    leftArm: "Left Arm",
    rightArm: "Right Arm",
    leftUpperArm: "Left Upper Arm",
    leftLowerArm: "Left Forearm",
    rightUpperArm: "Right Upper Arm",
    rightLowerArm: "Right Forearm",
    leftLeg: "Left Leg",
    rightLeg: "Right Leg",
    leftUpperLeg: "Left Thigh",
    leftLowerLeg: "Left Shin",
    rightUpperLeg: "Right Thigh",
    rightLowerLeg: "Right Shin",
};

const PART_COLORS: Record<string, string> = {
    head: "text-yellow-400",
    body: "text-orange-400",
    leftArm: "text-blue-400",
    rightArm: "text-purple-400",
    leftUpperArm: "text-blue-400",
    leftLowerArm: "text-cyan-400",
    rightUpperArm: "text-purple-400",
    rightLowerArm: "text-pink-400",
    leftLeg: "text-green-400",
    rightLeg: "text-indigo-400",
    leftUpperLeg: "text-green-400",
    leftLowerLeg: "text-lime-400",
    rightUpperLeg: "text-indigo-400",
    rightLowerLeg: "text-violet-400",
};

const axes: { key: 'x' | 'y' | 'z'; label: string; color: string }[] = [
    { key: 'x', label: 'X (Pitch)', color: 'text-red-400' },
    { key: 'y', label: 'Y (Yaw)', color: 'text-green-400' },
    { key: 'z', label: 'Z (Roll)', color: 'text-blue-400' },
];

const radToDeg = (rad: number) => Math.round((rad * 180) / Math.PI);

export const PoseControls = ({ pose, onPoseChange }: PoseControlsProps) => {
    const rotations = pose.poseConfig.rotations;
    const availableKeys = Object.keys(rotations);

    return (
        <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
                Manual Joint Manipulation
            </h4>

            {PART_GROUPS.map((group) => {
                // Only render parts that actually exist in current pose
                const groupParts = group.keys.filter((k) => availableKeys.includes(k));
                if (groupParts.length === 0) return null;

                return (
                    <div key={group.label} className="mb-6">
                        <h4 className={`text-[9px] font-black uppercase tracking-[0.25em] ${group.color} mb-3`}>
                            {group.label}
                        </h4>

                        <div className="space-y-3">
                            {groupParts.map((partName) => {
                                const euler = rotations[partName] as THREE.Euler;
                                const color = PART_COLORS[partName] || "text-gray-400";
                                const label = PART_LABELS[partName] || partName;

                                return (
                                    <div
                                        key={partName}
                                        className="space-y-3 p-4 bg-gray-950/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                                    >
                                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${color}`}>
                                            {label}
                                        </h4>

                                        <div className="grid grid-cols-1 gap-3">
                                            {axes.map((axis) => {
                                                const deg = radToDeg(euler[axis.key]);
                                                return (
                                                    <div key={axis.key} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label className={`text-[9px] ${axis.color} font-black uppercase tracking-tighter`}>
                                                                {axis.label}
                                                            </Label>
                                                            <span className="text-[10px] text-gray-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">
                                                                {deg}°
                                                            </span>
                                                        </div>
                                                        <Slider
                                                            value={[deg]}
                                                            onValueChange={([value]) =>
                                                                onPoseChange(partName, axis.key, value)
                                                            }
                                                            min={-180}
                                                            max={180}
                                                            step={5}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
