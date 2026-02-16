import { useState, useEffect } from 'preact/hooks';

interface Props {
    startDate: string;
    matchDate: string;
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
}

type Phase = 'SURVIVAL' | 'MATCH';

export default function TenureTimer({ startDate, matchDate, homeTeam, awayTeam }: Props) {
    const [duration, setDuration] = useState({ days: 0 });
    const [displayDays, setDisplayDays] = useState(0);
    const [matchTime, setMatchTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [score, setScore] = useState({ home: 0, away: 0 });
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

                // Start transition to MATCH after delay
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

    // Live Countdown for MATCH phase
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

    const handleScore = (team: 'home' | 'away', delta: number) => {
        setScore(prev => ({ ...prev, [team]: Math.max(0, prev[team] + delta) }));
    };

    const handleShare = (platform: 'X' | 'WA') => {
        const text = `¡MISIÓN INTEL! 🚨 Mi pronóstico: ${awayTeam.name} ${score.away}-${score.home} ${homeTeam.name}. ¡La salud de Arbeloa está en juego! 🔥 #BanquilloCaliente`;
        const url = window.location.href;

        if (platform === 'X') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        }
    };

    return (
        <div class={`w-full flex transition-all duration-500 items-center justify-center ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

            {phase === 'SURVIVAL' ? (
                <div class="flex flex-col items-center justify-center w-full min-h-[120px]">
                    <h3 class="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] opacity-70 mb-1 sm:mb-2 font-bold">Días Sobreviviendo</h3>
                    <div class="font-mono text-7xl sm:text-8xl md:text-9xl tracking-wider text-glow font-bold animate-pulse leading-none">
                        {displayDays}
                    </div>
                </div>
            ) : (
                <div class="flex flex-col items-center w-full gap-4 md:gap-8 min-h-[160px] justify-center">
                    {/* INTEGRATED SCOREBOARD HUD */}
                    <div class="flex items-center justify-around w-full max-w-3xl px-2">

                        {/* AWAY TEAM (LEFT) */}
                        <div class="flex flex-col items-center gap-1 flex-1">
                            <img src={awayTeam.logo} class="shrink-0 w-8 h-8 md:w-14 md:h-14 object-contain grayscale brightness-125" />
                            <span class="font-mono text-3xl md:text-6xl font-bold text-codec-green text-glow-sharp">{score.away}</span>
                            <div class="flex gap-1">
                                <button onClick={() => handleScore('away', 1)} class="w-5 h-5 flex items-center justify-center border border-codec-green text-[10px] hover:bg-codec-green hover:text-black cursor-pointer">+</button>
                                <button onClick={() => handleScore('away', -1)} class="w-5 h-5 flex items-center justify-center border border-codec-green text-[10px] hover:bg-codec-green hover:text-black cursor-pointer">-</button>
                            </div>
                            <span class="text-[7px] md:text-[8px] uppercase opacity-40 font-bold tracking-widest mt-1 text-center truncate max-w-[60px]">{awayTeam.name}</span>
                        </div>

                        {/* CENTER: MASSIVE COUNTDOWN */}
                        <div class="flex flex-col items-center flex-[1.5] py-2 border-x border-codec-green/10">
                            <h3 class="text-[7px] md:text-[9px] uppercase tracking-[0.2em] text-red-500 font-bold animate-pulse mb-1">STRIKE CLOCK</h3>
                            <div class="font-mono text-3xl md:text-7xl tracking-tighter text-glow-sharp font-bold flex gap-1 items-baseline">
                                <div class="flex flex-col items-center leading-none">
                                    <span>{String(matchTime.hours).padStart(2, '0')}</span>
                                    <span class="text-[5px] sm:text-[8px] opacity-40 uppercase">HRS</span>
                                </div>
                                <span class="opacity-40 animate-pulse text-lg sm:text-xl md:text-5xl">:</span>
                                <div class="flex flex-col items-center leading-none">
                                    <span>{String(matchTime.minutes).padStart(2, '0')}</span>
                                    <span class="text-[5px] sm:text-[8px] opacity-40 uppercase">MIN</span>
                                </div>
                                <span class="opacity-20 text-md sm:text-lg md:text-4xl">:</span>
                                <div class="flex flex-col items-center opacity-70 leading-none">
                                    <span class="text-lg sm:text-xl md:text-5xl">{String(matchTime.seconds).padStart(2, '0')}</span>
                                    <span class="text-[5px] sm:text-[8px] opacity-40 uppercase">SEC</span>
                                </div>
                            </div>
                        </div>

                        {/* HOME TEAM (RIGHT) */}
                        <div class="flex flex-col items-center gap-1 flex-1">
                            <img src={homeTeam.logo} class="shrink-0 w-8 h-8 md:w-14 md:h-14 object-contain grayscale brightness-125" />
                            <span class="font-mono text-3xl md:text-6xl font-bold text-codec-green text-glow-sharp">{score.home}</span>
                            <div class="flex gap-1">
                                <button onClick={() => handleScore('home', 1)} class="w-5 h-5 flex items-center justify-center border border-codec-green text-[10px] hover:bg-codec-green hover:text-black cursor-pointer">+</button>
                                <button onClick={() => handleScore('home', -1)} class="w-5 h-5 flex items-center justify-center border border-codec-green text-[10px] hover:bg-codec-green hover:text-black cursor-pointer">-</button>
                            </div>
                            <span class="text-[7px] md:text-[8px] uppercase opacity-40 font-bold tracking-widest mt-1 text-center truncate max-w-[60px]">{homeTeam.name}</span>
                        </div>

                    </div>

                    {/* MINI SHARE BUTTONS (Icon only) */}
                    <div class="flex gap-4 items-center">
                        <button onClick={() => handleShare('X')} class="w-8 h-8 flex items-center justify-center border-2 border-white text-white font-bold text-[10px] bg-black hover:bg-white hover:text-black transition-all shadow-[2px_2px_0_white] cursor-pointer">𝕏</button>
                        <button onClick={() => handleShare('WA')} class="w-8 h-8 flex items-center justify-center border-2 border-codec-green text-codec-green font-bold text-[10px] bg-black hover:bg-codec-green hover:text-black transition-all shadow-[2px_2px_0_#00ee00] cursor-pointer">WA</button>
                    </div>
                </div>
            )}
        </div>

    );
}
