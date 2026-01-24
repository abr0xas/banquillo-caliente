import { useState, useEffect } from 'preact/hooks';

interface Props {
    startDate: string;
}

export default function TenureTimer({ startDate }: Props) {
    const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const start = new Date(startDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = now - start;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setDuration({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startDate]);

    return (
        <div class="flex flex-col items-center justify-center w-full h-full text-codec-green">
            <h3 class="text-xs uppercase tracking-widest opacity-70 mb-1">Tiempo en el Banquillo</h3>
            <div class="font-mono text-4xl tracking-widest text-glow flex gap-1 items-baseline">
                <span>{String(duration.days).padStart(4, '0')}</span>
                <span class="text-sm">D</span>
                <span class="animate-pulse">:</span>
                <span>{String(duration.hours).padStart(2, '0')}</span>
                <span class="text-sm">H</span>
            </div>
            <div class="text-xs tracking-[0.5em] opacity-50 mt-1 uppercase">SISTEMA ACTIVO</div>
        </div>
    );
}
