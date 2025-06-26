# Real-Time Speech Analytics Dashboard

![Dashboard Screenshot](https://via.placeholder.com/800x500?text=Speech+Analytics+Dashboard)

A web-based application for real-time speech analysis, providing metrics on speaking rate, pitch, filler words, and more. All audio processing and analysis happens in the browser using the Web Audio API.

**Note:** The speech analysis (WPM, filler words, confidence) is currently *simulated* to demonstrate the front-end architecture and visualization capabilities. The core Web Audio API integration for capturing and visualizing raw audio data (waveform, pitch) is fully implemented.

## Features

- 🎤 Real-time audio recording and processing
- 📊 Visual analytics for speech metrics (WPM, confidence, etc.)
- 🌊 Audio waveform visualization
- 🎵 Pitch analysis with dynamic visualization
- 📈 Real-time analytics charts
- 🎯 Performance insights and suggestions

## Technology Stack

- Web Audio API for audio processing
- Chart.js for data visualization
- Vanilla JavaScript for core functionality
- Modern CSS for responsive design

## Setup Instructions

1. Clone this repository
2. Open `index.html` in a modern web browser
3. Grant microphone permissions when prompted

## Usage

1. Click "Start Recording" to begin audio capture
2. Speak naturally into your microphone
3. View real-time analytics as you speak
4. Click "Stop Recording" to end the session
5. Review your performance metrics and insights

## Key Metrics Tracked

- Words Per Minute (WPM)
- Speaking duration
- Filler word count
- Confidence score
- Pitch variation
- Speech fluency

## Development Notes

This project serves as a strong example of:
- **In-browser Audio Processing:** Capturing and analyzing microphone input using the Web Audio API (`AudioContext`, `AnalyserNode`).
- **Real-time Data Visualization:** Using Chart.js to display dynamic data for pitch and other analytics.
- **Front-end Architecture:** Separating concerns with HTML, CSS, and JavaScript, and managing application state (e.g., recording status).
- **DOM Manipulation:** Dynamically updating UI elements to reflect real-time data.

The speech analysis logic in `script.js` is currently simulated, providing a clear framework for integrating a more advanced, real speech-to-text or DSP library in the future.

## Future Enhancements

- Integration with speech recognition APIs
- Machine learning for more accurate analysis
- Export functionality for session reports
- Multi-language support

## License

MIT License - Free for educational and personal use