import { useState, useEffect } from 'preact/hooks';

interface Props {
    startDate: string;
    matchDate: string;
}

type Phase = 'SURVIVAL' | 'MATCH';

export default function TenureTimer({ startDate, matchDate }: Props) {
    const [duration, setDuration] = useState({ days: 0 });
    const [displayDays, setDisplayDays] = useState(0);
    const [matchTime, setMatchTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [phase, setPhase] = useState<Phase>('SURVIVAL');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Initial Survival Logic (Total Days)
    useEffect(() => {
        if (!startDate) return;
        const start = new Date(startDate).getTime();
        const now = new Date().getTime();
        const diff = now - start;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        setDuration({ days });
    }, [startDate]);

    // Count-up animation for Survival phase
    useEffect(() => {
        if (duration.days === 0 || phase !== 'SURVIVAL') return;

        let current = 0;
        const target = duration.days;
        const increment = Math.max(1, Math.floor(target / 40));
        const duration_ms = 1500;
        const stepTime = duration_ms / (target / increment);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setDisplayDays(target);
                clearInterval(timer);

                // Start transition to Match phase after a delay
                setTimeout(() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setPhase('MATCH');
                        setIsTransitioning(false);
                    }, 500);
                }, 2000);
            } else {
                setDisplayDays(current);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [duration.days]);

    // Live Countdown for Match phase
    useEffect(() => {
        if (phase !== 'MATCH' || !matchDate) return;

        const updateMatchTimer = () => {
            const now = new Date().getTime();
            const target = new Date(matchDate).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setMatchTime({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setMatchTime({ hours: h, minutes: m, seconds: s });
        };

        updateMatchTimer();
        const interval = setInterval(updateMatchTimer, 1000);
        return () => clearInterval(interval);
    }, [phase, matchDate]);

    return (
        <div class={`flex flex-col items-center justify-center w-full h-full text-codec-green transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>

            {phase === 'SURVIVAL' ? (
                <>
                    <h3 class="text-xs uppercase tracking-[0.3em] opacity-70 mb-2 font-bold">Días Sobreviviendo</h3>
                    <div class="font-mono text-8xl md:text-9xl tracking-wider text-glow font-bold animate-pulse">
                        {displayDays}
                    </div>
                </>
            ) : (
                <>
                    <h3 class="text-xs uppercase tracking-[0.3em] text-red-500 mb-2 font-bold animate-pulse">PRÓXIMO OBJETIVO: VILLARREAL</h3>
                    <div class="font-mono text-5xl md:text-7xl tracking-[0.2em] text-glow font-bold flex gap-4 items-center">
                        <div class="flex flex-col items-center">
                            <span>{String(matchTime.hours).padStart(2, '0')}</span>
                            <span class="text-[10px] opacity-50 uppercase tracking-tighter">HRS</span>
                        </div>
                        <span class="pb-4">:</span>
                        <div class="flex flex-col items-center">
                            <span>{String(matchTime.minutes).padStart(2, '0')}</span>
                            <span class="text-[10px] opacity-50 uppercase tracking-tighter">MIN</span>
                        </div>
                        <span class="pb-4 opacity-50 text-3xl">:</span>
                        <div class="flex flex-col items-center text-3xl opacity-70">
                            <span>{String(matchTime.seconds).padStart(2, '0')}</span>
                            <span class="text-[10px] opacity-50 uppercase tracking-tighter">SEC</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
