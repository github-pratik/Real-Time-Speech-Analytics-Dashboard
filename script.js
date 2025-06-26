let isRecording = false;
let startTime;
let audioContext;
let mediaStream;
let analyzer;
let pitchChart;
let analyticsChart;
let animationFrame;

// Simulated data for demonstration
let wordCount = 0;
let fillerWords = ['um', 'uh', 'like', 'you know', 'basically'];
let detectedFillers = [];
let pitchData = [];
let timeLabels = [];

// Initialize charts
function initCharts() {
    // Pitch Chart
    const pitchCtx = document.getElementById('pitchChart').getContext('2d');
    pitchChart = new Chart(pitchCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Pitch (Hz)',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 400,
                    title: {
                        display: true,
                        text: 'Frequency (Hz)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time (s)'
                    }
                }
            }
        }
    });
    
    // Analytics Chart
    const analyticsCtx = document.getElementById('analyticsChart').getContext('2d');
    analyticsChart = new Chart(analyticsCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'WPM',
                data: [],
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                yAxisID: 'y'
            }, {
                label: 'Fluency %',
                data: [],
                borderColor: '#ed8936',
                backgroundColor: 'rgba(237, 131, 54, 0.1)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Words Per Minute'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Fluency Score (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Start recording function
async function startRecording() {
    resetAnalytics();
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const source = audioContext.createMediaStreamSource(mediaStream);
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2048;
        source.connect(analyzer);
        
        isRecording = true;
        startTime = Date.now();
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('status').textContent = 'Recording';
        document.getElementById('status').className = 'status recording';
        
        // Start analysis loop
        analyzeAudio();
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access to use this feature.');
    }
}

// Stop recording function
function stopRecording() {
    isRecording = false;
    
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContext) {
        audioContext.close();
    }
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    document.getElementById('status').textContent = 'Processing';
    document.getElementById('status').className = 'status processing';
    
    // Simulate processing delay
    setTimeout(() => {
        document.getElementById('status').textContent = 'Complete';
        document.getElementById('status').className = 'status ready';
        generateInsights();
    }, 1500);
}

// Reset analytics
function resetAnalytics() {
    wordCount = 0;
    detectedFillers = [];
    pitchData = [];
    timeLabels = [];
    
    // Reset displays
    document.getElementById('wpm').textContent = '0';
    document.getElementById('duration').textContent = '0.0s';
    document.getElementById('fillerCount').textContent = '0';
    document.getElementById('confidence').textContent = '0%';
    document.getElementById('fillerTags').innerHTML = '';
    document.getElementById('currentPitch').textContent = '-- Hz';
    document.getElementById('dominantFreq').textContent = '-- Hz';
    document.getElementById('amplitude').textContent = '--';
    document.getElementById('signalQuality').textContent = '--';
    
    // Clear waveform
    document.getElementById('waveform').innerHTML = '';
    
    // Reset charts
    if (pitchChart) {
        pitchChart.data.labels = [];
        pitchChart.data.datasets[0].data = [];
        pitchChart.update();
    }
    
    if (analyticsChart) {
        analyticsChart.data.labels = [];
        analyticsChart.data.datasets[0].data = [];
        analyticsChart.data.datasets[1].data = [];
        analyticsChart.update();
    }
}

// Analyze audio in real-time
function analyzeAudio() {
    if (!isRecording) return;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const frequencyData = new Uint8Array(bufferLength);
    analyzer.getByteTimeDomainData(dataArray);
    analyzer.getByteFrequencyData(frequencyData);
    
    // Update duration
    const currentTime = (Date.now() - startTime) / 1000;
    document.getElementById('duration').textContent = currentTime.toFixed(1) + 's';
    
    // Simulate speech analysis
    simulateSpeechAnalysis(currentTime, dataArray, frequencyData);
    
    // Update waveform visualization
    updateWaveform(dataArray);
    
    // Update pitch analysis
    updatePitchAnalysis(currentTime);
    
    animationFrame = requestAnimationFrame(analyzeAudio);
}

// Simulate speech analysis (in real implementation, this would be actual DSP)
function simulateSpeechAnalysis(currentTime, timeData, frequencyData) {
    // Simulate word detection
    if (Math.random() > 0.85) {
        wordCount++;
        // Simulate filler word detection
        if (Math.random() > 0.9) {
            const filler = fillerWords[Math.floor(Math.random() * fillerWords.length)];
            detectedFillers.push(filler);
            updateFillerDisplay();
        }
    }
    
    // Calculate WPM
    const wpm = Math.round((wordCount / currentTime) * 60);
    document.getElementById('wpm').textContent = wpm;
    
    // Update filler count
    document.getElementById('fillerCount').textContent = detectedFillers.length;
    
    // Simulate confidence score
    const confidence = Math.max(70, Math.min(95, 85 + Math.sin(currentTime) * 10));
    document.getElementById('confidence').textContent = Math.round(confidence) + '%';
    
    // Update frequency analysis
    const avgFrequency = frequencyData.reduce((a, b) => a + b) / frequencyData.length;
    document.getElementById('dominantFreq').textContent = Math.round(avgFrequency * 10) + ' Hz';
    document.getElementById('amplitude').textContent = (avgFrequency / 255).toFixed(2);
    document.getElementById('signalQuality').textContent = avgFrequency > 50 ? 'Good' : 'Poor';
    
    // Update analytics chart
    if (analyticsChart && currentTime > 0) {
        const wpm = parseInt(document.getElementById('wpm').textContent);
        const fluency = parseInt(document.getElementById('confidence').textContent);
        analyticsChart.data.labels.push(currentTime.toFixed(1));
        analyticsChart.data.datasets[0].data.push(wpm);
        analyticsChart.data.datasets[1].data.push(fluency);
        
        // Keep only last 15 data points
        if (analyticsChart.data.labels.length > 15) {
            analyticsChart.data.labels.shift();
            analyticsChart.data.datasets[0].data.shift();
            analyticsChart.data.datasets[1].data.shift();
        }
        analyticsChart.update('none');
    }
}

// Update waveform visualization
function updateWaveform(dataArray) {
    const waveform = document.getElementById('waveform');
    waveform.innerHTML = '';
    const width = waveform.offsetWidth;
    const bars = 50;
    const barWidth = width / bars;
    for (let i = 0; i < bars; i++) {
        const bar = document.createElement('div');
        bar.className = 'wave-bar';
        const dataIndex = Math.floor((i / bars) * dataArray.length);
        const amplitude = Math.abs(dataArray[dataIndex] - 128);
        const height = (amplitude / 128) * 80;
        bar.style.left = (i * barWidth) + 'px';
        bar.style.width = (barWidth - 1) + 'px';
        bar.style.height = height + 'px';
        waveform.appendChild(bar);
    }
}

// Update pitch analysis
function updatePitchAnalysis(currentTime) {
    const pitch = 150 + Math.sin(currentTime * 2) * 50 + Math.random() * 20;
    document.getElementById('currentPitch').textContent = Math.round(pitch) + ' Hz';
    
    // Update pitch marker position
    const pitchMarker = document.getElementById('pitchMarker');
    const percentage = Math.min(100, Math.max(0, (pitch - 100) / 200 * 100));
    pitchMarker.style.left = percentage + '%';
    
    // Update pitch chart
    if (pitchChart && currentTime > 0) {
        pitchChart.data.labels.push(currentTime.toFixed(1));
        pitchChart.data.datasets[0].data.push(pitch);
        
        // Keep only last 20 data points
        if (pitchChart.data.labels.length > 20) {
            pitchChart.data.labels.shift();
            pitchChart.data.datasets[0].data.shift();
        }
        pitchChart.update('none');
    }
}

// Update filler word display
function updateFillerDisplay() {
    const container = document.getElementById('fillerTags');
    container.innerHTML = '';
    detectedFillers.slice(-5).forEach(filler => {
        const tag = document.createElement('span');
        tag.className = 'filler-tag';
        tag.textContent = filler;
        container.appendChild(tag);
    });
}

// Generate insights after recording
function generateInsights() {
    const insights = document.getElementById('insights');
    const wpm = parseInt(document.getElementById('wpm').textContent);
    const fillerCount = detectedFillers.length;
    let newInsights = [];
    
    if (wpm < 120) {
        newInsights.push('📌 <strong>Tip:</strong> Try to increase speaking pace slightly for better engagement');
    } else if (wpm > 180) {
        newInsights.push('📌 <strong>Tip:</strong> Consider slowing down slightly for better comprehension');
    } else {
        newInsights.push('📌 <strong>Excellent:</strong> Your speaking pace is optimal for comprehension');
    }
    
    if (fillerCount > 5) {
        newInsights.push('📌 <strong>Focus Area:</strong> Work on reducing filler words for more professional delivery');
    } else {
        newInsights.push('📌 <strong>Great:</strong> Minimal use of filler words detected');
    }
    
    newInsights.push('📌 <strong>Observation:</strong> Pitch variation shows good intonation patterns');
    insights.innerHTML = newInsights.join('<br>');
    
    // Update trend indicators
    document.getElementById('rateTrend').textContent = wpm > 150 ? 'Increasing' : 'Stable';
    document.getElementById('fluencyScore').textContent = Math.max(75, 100 - fillerCount * 3) + '%';
    document.getElementById('pronunciation').textContent = (90 + Math.random() * 8).toFixed(0) + '%';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
});