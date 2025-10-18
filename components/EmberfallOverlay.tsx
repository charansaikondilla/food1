import React, { useRef, useEffect } from 'react';

const EmberfallOverlay: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: Particle[] = [];
        const particleCount = 50;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedY: number;
            opacity: number;
            life: number;
            maxLife: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedY = Math.random() * 1 + 0.5;
                this.opacity = 1;
                this.maxLife = Math.random() * 150 + 100;
                this.life = this.maxLife;
            }

            draw(context: CanvasRenderingContext2D) {
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fillStyle = `rgba(239, 68, 68, ${this.opacity})`; // Vibrant red
                context.shadowColor = 'rgba(220, 38, 38, 0.7)'; // Strong red glow
                context.shadowBlur = 8;
                context.fill();
                context.closePath();
            }

            update() {
                this.y += this.speedY;
                this.life -= 1;
                
                // Fade out at the end of life
                this.opacity = Math.max(0, this.life / this.maxLife);

                if (this.y > canvas.height + this.size || this.life <= 0) {
                    this.reset();
                }
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -this.size;
                this.size = Math.random() * 2 + 1;
                this.speedY = Math.random() * 1 + 0.5;
                this.life = Math.random() * 150 + 100;
                this.maxLife = this.life;
                this.opacity = 1;
            }
        }
        
        const init = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        init();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };

    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
        />
    );
};

export default EmberfallOverlay;