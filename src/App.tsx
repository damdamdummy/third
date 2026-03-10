import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Heart, Clock, Camera, PenTool } from 'lucide-react';

const FilmGrain = () => (
    <>
        <div className="film-grain" />
        {/* <div className="vignette" /> */}
    </>
);

const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(text.slice(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, 100);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [text, delay]);

    return (
        <span className="typewriter">
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-white ml-1 align-middle"
            />
        </span>
    );
};

const ScrollIndicator = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
    >
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline className="chevron-1" points="2,2 12,12 22,2" stroke="rgba(200,192,176,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline className="chevron-2" points="2,14 12,24 22,14" stroke="rgba(200,192,176,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline className="chevron-3" points="2,26 12,36 22,26" stroke="rgba(200,192,176,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </motion.div>
);

const Countdown = ({ startDate }: { startDate: Date }) => {
    const [time, setTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const anniversaryDate = new Date('2025-12-12T21:33:00+07:00');
            const now = new Date();
            const diff = now.getTime() - anniversaryDate.getTime();

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTime({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(interval);
    }, [startDate]);

    return (
        <div className="flex flex-col items-center justify-center space-y-1 py-1">
            <div className="text-sm uppercase tracking-[0.3em] opacity-50 mb-4">Every second since we "began"</div>
            <div className="flex space-x-8 text-4xl md:text-6xl font-light">
                <div className="flex flex-col items-center">
                    <span>{time.days}</span>
                    <span className="text-xs uppercase tracking-widest opacity-40 mt-2">Days</span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{time.hours}</span>
                    <span className="text-xs uppercase tracking-widest opacity-40 mt-2">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{time.minutes}</span>
                    <span className="text-xs uppercase tracking-widest opacity-40 mt-2">Mins</span>
                </div>
                <div className="flex flex-col items-center">
                    <span>{time.seconds}</span>
                    <span className="text-xs uppercase tracking-widest opacity-40 mt-2">Secs</span>
                </div>
            </div>
        </div>
    );
};

const GalleryItem = ({ src, note, index }: { src: string; note: string; index: number }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`flex flex-col items-center gap-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
        >
            <div className="w-full aspect-[3/4] overflow-hidden rounded-sm">
                <img
                    src={src}
                    alt="Memory"
                    className="w-full h-full object-cover grayscale contrast-125 brightness-75 hover:brightness-100 transition-all duration-700 noir-shadow"
                />
            </div>

            {/* <div className="w-full flex flex-col items-center justify-center text-center">
                <div className="handwritten text-sm md:text-xl opacity-80 leading-snug">
                    {note}
                </div>
            </div> */}
        </div>
    );
};

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[10000] flex items-center space-x-4 bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-full">
            <audio
                ref={audioRef}
                loop
                src="/assets/mkow.mp3"
            />
            <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <div className="text-[10px] uppercase tracking-widest opacity-50 pr-2">
                {isPlaying ? 'Now Playing: My Kind of Woman' : ''}
            </div>
        </div>
    );
};

export default function App() {
    const startDate = new Date('2025-12-05T00:00:00');

    const memories = [
        {
            src: "assets/sophia.png",
            // note: "Hi Sophia blablabla"
        },
        {
            src: "assets/adam.png",
            // note: (
            //     <div className="flex flex-col items-center gap-4">
            //         <Heart size={48} strokeWidth={1} className="opacity-40" />
            //     </div>
            // )
        }
    ];

    return (
        <div className="relative min-h-screen selection:bg-white selection:text-black">
            <FilmGrain />
            <MusicPlayer />
            <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/b.JPG"
                        alt="Background"
                        className="w-full h-full object-cover grayscale opacity-40 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black" />
                </div>

                <div className="z-10 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5 }}
                        className="mb-12"
                    >

                        <p className="t-mono text-[9px] uppercase tracking-[0.6em] opacity-40 mb-6">
                            dedicated to
                        </p>
                        <div className="w-24 h-px mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(160,128,96,0.5), transparent)' }} />
                        <h1 className="text-6xl mt-2 md:text-8xl font-light tracking-tighter mb-4 font-thin italic">
                            Sophia
                        </h1>
                    </motion.div>

                    <div className="h-24 flex items-center justify-center">
                        <Typewriter
                            text="&quot;You're my kind of woman.&quot;"
                            delay={1500}
                        />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 4, duration: 2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
                >
                    <ScrollIndicator />
                </motion.div>
            </section>

            <section className="max-w-5xl mx-auto px-4 py-5">
                <Countdown startDate={startDate} />
            </section>

            <section className="max-w-5xl mx-auto px-4 py-5">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-16">
                    {memories.map((memory, i) => (
                        <GalleryItem key={i} {...memory} index={i} />
                    ))}
                </div>
            </section>


            <section className="max-w-3xl mx-auto px-4 py-32 text-center">
                <div className="handwritten text-4xl md:text-5xl mb-12 opacity-90">
                    Happy 3rd Monthsary, <br /> sayang.
                </div>
                <div className="typewriter text-sm md:text-base mb-20 opacity-70">
                    I've said this before and I will say it again. <br />
                    Thank you for sticking with me, for choosing this messy (and sometimes awkward) guy and still seeing the best in me.
                    I know I'm not the most expressive person, but I mean everything I feel for you. I hope you still feel my love for you, even in my silence.
                </div>
                <div className="text-sm uppercase tracking-[0.4em] opacity-30">
                    Yours always, Adam
                </div>
                <div className="mt-32 flex justify-center opacity-10">
                    <Heart size={48} strokeWidth={1} />
                </div>
            </section>

            <footer className="py-12 text-center border-t border-white/5 opacity-20">
                <div className="text-[10px] uppercase tracking-[0.5em]">
                    March 12, 2026
                </div>
            </footer>
        </div>
    );
}
