import { useState, useRef, useEffect } from 'preact/hooks';

export default function AudioSystem() {
    const [isEnabled, setIsEnabled] = useState(false);
    const audioCtx = useRef<AudioContext | null>(null);
    const heartbeatTimer = useRef<number | null>(null);

    const initAudio = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtx.current.state === 'suspended') {
            audioCtx.current.resume();
        }
        setIsEnabled(true);
    };

    const stopAudio = () => {
        setIsEnabled(false);
        if (heartbeatTimer.current) {
            clearInterval(heartbeatTimer.current);
            heartbeatTimer.current = null;
        }
    };

    const playHeartbeat = () => {
        if (!audioCtx.current || audioCtx.current.state !== 'running') return;

        const now = audioCtx.current.currentTime;

        // HEARTBEAT Logic (Lub-Dub)
        const playThump = (time: number, freq: number, volume: number) => {
            const osc = audioCtx.current!.createOscillator();
            const gain = audioCtx.current!.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(10, time + 0.15);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(volume, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

            osc.connect(gain);
            gain.connect(audioCtx.current!.destination);

            osc.start(time);
            osc.stop(time + 0.3);
        };

        // Lub
        playThump(now, 60, 0.4);
        // Dub
        playThump(now + 0.2, 50, 0.3);
    };

    const playBeep = () => {
        if (!audioCtx.current || audioCtx.current.state !== 'running') return;

        const now = audioCtx.current.currentTime;
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(audioCtx.current.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    };

    useEffect(() => {
        if (isEnabled) {
            // Heartbeat loop (~70 BPM)
            heartbeatTimer.current = window.setInterval(() => {
                playHeartbeat();
                // Randomly add a monitor beep occasionally for atmosphere
                if (Math.random() > 0.7) {
                    setTimeout(playBeep, 400);
                }
            }, 850);
        } else {
            if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
        }
        return () => { if (heartbeatTimer.current) clearInterval(heartbeatTimer.current); };
    }, [isEnabled]);

    return (
        <div class="flex items-center gap-2">
            <button
                onClick={isEnabled ? stopAudio : initAudio}
                class={`px-2 py-1 border text-[10px] tracking-widest font-bold transition-all duration-300 cursor-pointer ${isEnabled
                        ? 'bg-codec-green text-black border-codec-green shadow-[0_0_10px_#00ee00]'
                        : 'bg-black text-codec-green border-codec-green/50 opacity-60 hover:opacity-100'
                    }`}
            >
                {isEnabled ? 'COMMS: SYNCED' : 'SYNC COMMS AUDIO'}
            </button>
            {isEnabled && (
                <div class="flex gap-0.5 items-end h-3 animate-pulse">
                    <div class="w-0.5 h-full bg-codec-green"></div>
                    <div class="w-0.5 h-1/2 bg-codec-green"></div>
                    <div class="w-0.5 h-3/4 bg-codec-green"></div>
                </div>
            )}
        </div>
    );
}
