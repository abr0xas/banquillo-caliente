import { useState, useEffect } from 'preact/hooks';

interface Props {
    startDate: string;
}

export default function TenureTimer({ startDate }: Props) {
    const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [displayDays, setDisplayDays] = useState(0);

    useEffect(() => {
        if (!startDate) {
            console.error('No startDate provided to TenureTimer');
            return;
        }

        const start = new Date(startDate).getTime();
        console.log('Start date:', startDate, 'Timestamp:', start);

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = now - start;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            console.log('Calculated days:', days);
            setDuration({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startDate]);

    // Count-up animation effect
    useEffect(() => {
        if (duration.days === 0) return;

        let current = 0;
        const target = duration.days;
        const increment = Math.max(1, Math.floor(target / 30)); // Animate over ~30 steps
        const duration_ms = 2000; // 2 seconds total
        const stepTime = duration_ms / (target / increment);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setDisplayDays(target);
                clearInterval(timer);
            } else {
                setDisplayDays(current);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [duration.days]);


    return (
        <div class="flex flex-col items-center justify-center w-full h-full text-codec-green">
            <h3 class="text-xs uppercase tracking-widest opacity-70 mb-2">Días Sobreviviendo</h3>
            <div class="font-mono text-8xl md:text-9xl tracking-wider text-glow font-bold animate-pulse">
                {displayDays}
            </div>
        </div>
    );

}
