import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface StarBackgroundProps {
    starCount?: number;
    shootingStarCount?: number;
    className?: string;
}

const generateShootingStar = (baseId: number, isInitial = false) => ({
    id: `shooting-${baseId}-${Date.now()}-${Math.random()}`, 
    baseId,
    initialX: Math.random() * 120 - 10,
    initialY: Math.random() * 40 - 10,
    size: Math.random() * 2 + 2,
    duration: Math.random() * 1.2 + 1.0,
    delay: isInitial ? Math.random() * 10 : Math.random() * 15 + 10,
});

export function StarBackground({ starCount = 60, shootingStarCount = 4, className = '' }: StarBackgroundProps) {
    const stars = useMemo(() => {
        return Array.from({ length: starCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1.5,
            depth: Math.random(),
            twinkleDuration: Math.random() * 4 + 2,
        }));
    }, [starCount]);

    const [shootingStars, setShootingStars] = useState(() =>
        Array.from({ length: shootingStarCount }, (_, i) => generateShootingStar(i, true))
    );

    const handleAnimationComplete = useCallback((baseId: number) => {
        setShootingStars((prev) =>
            prev.map((star) =>
                star.baseId === baseId ? generateShootingStar(baseId, false) : star
            )
        );
    }, []);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
            mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, [mouseX, mouseY]);

    return (
        <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}>
            {/* Renderiza as estrelas normais (mantido) */}
            {stars.map((s) => {
                const parallaxStrength = s.depth * 20;
                return (
                    <motion.div
                        key={s.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${s.x}%`,
                            top: `${s.y}%`,
                            width: s.size,
                            height: s.size,
                            x: useTransform(mouseX, [-1, 1], [-parallaxStrength, parallaxStrength]),
                            y: useTransform(mouseY, [-1, 1], [-parallaxStrength, parallaxStrength]),
                            boxShadow: s.depth > 0.4 ? `0 0 ${s.size * 3}px rgba(255, 255, 255, 0.8)` : 'none',
                        }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: s.twinkleDuration, repeat: Infinity, ease: 'easeInOut' }}
                    />
                );
            })}

            {/* Renderiza as estrelas cadentes */}
            {shootingStars.map((s) => (
                <motion.div
                    key={s.id} // <-- A mágica acontece aqui: nova chave = novo elemento montado no lugar certo
                    className="absolute bg-white rounded-full"
                    style={{
                        top: `${s.initialY}%`,
                        left: `${s.initialX}%`,
                        width: s.size,
                        height: s.size,
                        boxShadow: `0 0 10px 3px rgba(255, 255, 255, 0.9), 0 0 20px 6px rgba(255, 255, 255, 0.4)`,
                        z: 10
                    }}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ 
                        opacity: [0, 1, 1, 0], 
                        x: -400, 
                        y: 400,  
                    }}
                    transition={{
                        duration: s.duration,
                        delay: s.delay, // O delay aleatório agora faz parte do nascimento da estrela
                        ease: "easeIn"
                        // NOTA: Removemos o repeat e o repeatDelay daqui!
                    }}
                    onAnimationComplete={() => handleAnimationComplete(s.baseId)} // Dispara ao fim da animação
                >
                     {/* Cauda visual da estrela (Mantida) */}
                     <div 
                        className="absolute top-1/2 left-1/2 -translate-y-1/2 h-[1px] w-[60px] origin-left rotate-[-135deg]" 
                        style={{ 
                            background: 'linear-gradient(to right, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                            filter: 'blur(1.5px)', 
                            opacity: 0.6 
                        }}
                     />
                </motion.div>
            ))}
        </div>
    );
}