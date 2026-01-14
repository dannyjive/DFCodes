
        // Animated wave pattern
        const canvas = document.getElementById('waveCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let time = 0;

        function drawWaves() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(100, 181, 246, 0.3)';
            ctx.lineWidth = 1;

            for (let i = 0; i < 50; i++) {
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 5) {
                    const y = canvas.height / 2 + Math.sin(x * 0.01 + time + i * 0.1) * 50 + i * 15;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            time += 0.02;
            requestAnimationFrame(drawWaves);
        }

        drawWaves();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
  