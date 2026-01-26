import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Pose } from "./posePresets";

interface PoseControlsProps {
    pose: Pose;
    onPoseChange: (
        bodyPart: keyof Pose["poseConfig"],
        axis: "x" | "y" | "z" | "bendAngle",
        value: number
    ) => void;
}

export const PoseControls = ({ pose, onPoseChange }: PoseControlsProps) => {
    const bodyParts = [
        { key: "head" as const, label: "Head", color: "text-yellow-400" },
        { key: "body" as const, label: "Body", color: "text-orange-400" },
        { key: "leftUpperArm" as const, label: "Left Arm", color: "text-blue-400", supportsBend: true },
        { key: "rightUpperArm" as const, label: "Right Arm", color: "text-purple-400", supportsBend: true },
        { key: "leftUpperLeg" as const, label: "Left Leg", color: "text-green-400", supportsBend: true },
        { key: "rightUpperLeg" as const, label: "Right Leg", color: "text-indigo-400", supportsBend: true },
    ];

    const axes = [
        { key: "x" as const, label: "X (Pitch)", color: "text-red-400" },
        { key: "y" as const, label: "Y (Yaw)", color: "text-green-400" },
        { key: "z" as const, label: "Z (Roll)", color: "text-blue-400" },
    ];

    return (
        <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">
                Cinematic Joint Controls
            </h4>

            {/* --- BODY CONTROLS --- */}
            <div className="space-y-4">
                {bodyParts.map((bodyPart) => (
                    <div
                        key={bodyPart.key}
                        className="space-y-4 p-4 bg-gray-950/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                    >
                        <h4 className={`text-[10px] font-black uppercase tracking-widest ${bodyPart.color}`}>{bodyPart.label}</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {axes.map((axis) => (
                                <div key={axis.key} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className={`text-[9px] ${axis.color} font-black uppercase tracking-tighter`}>
                                            {axis.label}
                                        </Label>
                                        <span className="text-[10px] text-gray-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">
                                            {pose.poseConfig[bodyPart.key][axis.key]}°
                                        </span>
                                    </div>
                                    <Slider
                                        value={[pose.poseConfig[bodyPart.key][axis.key]]}
                                        onValueChange={([value]) =>
                                            onPoseChange(bodyPart.key, axis.key, value)
                                        }
                                        min={-180}
                                        max={180}
                                        step={5}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Bend Angle Control for Bendable Model */}
                        {bodyPart.supportsBend && (
                            <div className="mt-2 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-[9px] text-amber-500 font-black uppercase tracking-tighter">
                                        Joint Flexion
                                    </Label>
                                    <span className="text-[10px] text-gray-400 font-mono bg-black/40 px-1.5 py-0.5 rounded">
                                        {pose.poseConfig[bodyPart.key].bendAngle || 0}°
                                    </span>
                                </div>
                                <Slider
                                    value={[pose.poseConfig[bodyPart.key].bendAngle || 0]}
                                    onValueChange={([value]) =>
                                        onPoseChange(bodyPart.key, "bendAngle", value)
                                    }
                                    min={0}
                                    max={120}
                                    step={5}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- FACIAL CONTROLS (Optional) --- */}
            {pose.facial && (
                <div className="mt-8 space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Facial Expression Engine</h4>

                    {pose.facial.eyes && (
                        <div className="space-y-4 p-4 bg-gray-950/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Optical Sensors</h4>
                            <div className="space-y-2">
                                <Label className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Blink Compression</Label>
                                <Slider
                                    value={[pose.facial.eyes.blink]}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}

                    {pose.facial.mouth && (
                        <div className="space-y-4 p-4 bg-gray-950/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-400">Mandibular Data</h4>
                            <div className="space-y-2">
                                <Label className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Smile Curvature</Label>
                                <Slider
                                    value={[pose.facial.mouth.smile]}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Aperture Scale</Label>
                                <Slider
                                    value={[pose.facial.mouth.open]}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
