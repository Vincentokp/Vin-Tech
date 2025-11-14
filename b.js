
    
        // Simple high-precision stopwatch
        const display = document.getElementById('display');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapBtn = document.getElementById('lapBtn');
        const lapsEl = document.getElementById('laps');

        let startTime = 0;
        let elapsed = 0; // ms
        let rafId = null;
        let running = false;
        let lapCount = 0;

        function formatTime(ms) {
            const total = Math.floor(ms);
            const hours = Math.floor(total / 3600000);
            const minutes = Math.floor((total % 3600000) / 60000);
            const seconds = Math.floor((total % 60000) / 1000);
            const centi = Math.floor((total % 1000) / 10);
            const hh = String(hours).padStart(2, '0');
            const mm = String(minutes).padStart(2, '0');
            const ss = String(seconds).padStart(2, '0');
            const cc = String(centi).padStart(2, '0');
            return `${hh}:${mm}:${ss}.${cc}`;
        }

        function update() {
            const now = performance.now();
            elapsed = now - startTime;
            display.textContent = formatTime(elapsed);
            rafId = requestAnimationFrame(update);
        }

        function start() {
            if (running) return;
            running = true;
            startTime = performance.now() - elapsed;
            rafId = requestAnimationFrame(update);
            startBtn.disabled = true;
        }

        function stop() {
            if (!running) return;
            running = false;
            cancelAnimationFrame(rafId);
            elapsed = performance.now() - startTime;
            display.textContent = formatTime(elapsed);
            startBtn.disabled = false;
        }

        function reset() {
            stop();
            elapsed = 0;
            display.textContent = formatTime(0);
            lapsEl.innerHTML = '';
            lapCount = 0;
        }

        function lap() {
            if (!running) return;
            lapCount++;
            const li = document.createElement('div');
            li.className = 'lap';
            li.innerHTML = `<div>Lap ${lapCount}</div><div>${formatTime(elapsed)}</div>`;
            lapsEl.prepend(li);
        }

        // Wire controls
        startBtn.addEventListener('click', start);
        stopBtn.addEventListener('click', stop);
        resetBtn.addEventListener('click', reset);
        lapBtn.addEventListener('click', lap);

        // Keyboard shortcuts: Space = start/stop, L = lap, R = reset
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                running ? stop() : start();
            } else if (e.key.toLowerCase() === 'l') {
                lap();
            } else if (e.key.toLowerCase() === 'r') {
                reset();
            }
        });

        // Initialize display
        display.textContent = formatTime(0);
