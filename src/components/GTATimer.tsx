import { useState, useEffect } from 'preact/hooks';

interface Props {
    targetDate?: string;
    title?: string;
    isCountdown?: boolean;
}

export default function GTATimer({
    targetDate = "2026-01-24T21:00:00Z",
    title = "TIEMPO PARA EL SIGUIENTE COMBATE",
    isCountdown = true
}: Props) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTime = () => {
            const target = new Date(targetDate).getTime();
            const now = new Date().getTime();
            const difference = isCountdown ? target - now : now - target;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        const timer = setInterval(calculateTime, 1000);
        calculateTime();

        return () => clearInterval(timer);
    }, [targetDate, isCountdown]);

    const TimeUnit = ({ value, label, showSeparator = true }: { value: number, label: string, showSeparator?: boolean }) => (
        <div class="flex items-center">
            <div class="flex flex-col items-center">
                <div class="text-4xl sm:text-7xl md:text-8xl font-sans font-black text-gtavi-glow leading-none tabular-nums tracking-tighter">
                    {String(value).padStart(label === 'DAYS' ? 1 : 2, '0')}
                </div>
                <div class="text-[9px] sm:text-xs font-sans font-black tracking-[0.2em] text-white mt-1 sm:mt-3 uppercase opacity-80">
                    {label}
                </div>
            </div>
            {showSeparator && (
                <div class="text-2xl sm:text-6xl md:text-7xl font-sans font-black text-gtavi-glow px-1 sm:px-4 md:px-6 self-start mt-1 mb-6">
                    :
                </div>
            )}
        </div>
    );

    return (
        <div class="w-full codec-panel py-6 sm:py-10 px-4 relative overflow-hidden group">
            {/* Corner Markers */}
            <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-codec-green opacity-50" />
            <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-codec-green opacity-50" />
            <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-codec-green opacity-50" />
            <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-codec-green opacity-50" />

            <div class="max-w-4xl mx-auto flex flex-col items-center">
                <div class="flex items-center gap-3 mb-8">
                    <div class="w-1.5 h-1.5 bg-gtavi-pink animate-pulse rounded-full" />
                    <h2 class="text-[10px] sm:text-xs md:text-sm font-sans font-black text-white tracking-[0.5em] text-center uppercase opacity-60">
                        {title}
                    </h2>
                    <div class="w-1.5 h-1.5 bg-gtavi-pink animate-pulse rounded-full" />
                </div>

                <div class="flex flex-wrap justify-center items-center gap-y-4">
                    <TimeUnit value={timeLeft.days} label="DAYS" />
                    <TimeUnit value={timeLeft.hours} label="HOURS" />
                    <TimeUnit value={timeLeft.minutes} label="MINS" />
                    <TimeUnit value={timeLeft.seconds} label="SECS" showSeparator={false} />
                </div>

                <div class="mt-6 sm:mt-10 flex gap-0.5 sm:gap-1.5 items-center opacity-20 overflow-hidden w-full justify-center">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} class={`h-0.5 sm:h-1 w-4 sm:w-8 bg-white shrink-0 ${i % 4 === 0 ? 'animate-pulse' : ''}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

