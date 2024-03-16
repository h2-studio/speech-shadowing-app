import Crunker from "crunker";
const DomainLength = 20;
const DomainInterval = 50;
const LowDomainThreshold = DomainLength * 0.9;
const MinLowDomain = 120;
const MaxLowDomain = 136;
const FFTSize = 128;

export class AudioService {
  private _recorder: MediaRecorder;
  private _ctx: AudioContext;
  private _maxDurationTimeoutId: number;
  private _analyzeIntervalId: number;
  public onStateUpdate: (isRecording: boolean) => void;

  private get context(): AudioContext {
    if (this._ctx == null) {
      this._ctx = new AudioContext();
    }

    return this._ctx;
  }

  private startAnalyze() {
    // stop record if low domain data over the threshold
    let mediaStreamSource = this.context.createMediaStreamSource(
      this._recorder.stream
    );

    let analyzer = this.context.createAnalyser();

    analyzer.fftSize = FFTSize;
    mediaStreamSource.connect(analyzer);

    let buffer = new Uint8Array(analyzer.frequencyBinCount);
    let avgDomains = [];

    let analyze = () => {
      analyzer.getByteTimeDomainData(buffer);

      let avg = buffer.reduce((a, b) => a + b) / buffer.length;

      avgDomains.push(avg);

      if (avgDomains.length > DomainLength) {
        avgDomains.shift();

        let lowDomainCount = 0;

        for (const i of avgDomains) {
          if (i > MinLowDomain && i < MaxLowDomain) {
            lowDomainCount++;
          }
        }

        if (lowDomainCount > LowDomainThreshold) {
          this.stop();
          // console.log("Stop recording at low domain", avgDomains);
        }
      }
    };

    this._analyzeIntervalId = setInterval(analyze, DomainInterval);
  }

  public record(maxDuration: number, callback: (result: AudioBuffer) => void) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((mediaStream) => {
        this.onStateUpdate?.(true);

        let chunks = [] as Blob[];
        this._recorder = new MediaRecorder(mediaStream);
        this._recorder.ondataavailable = async (e) => {
          chunks.push(e.data);

          if (this._recorder.state == "inactive") {
            // the last data
            mediaStream.getTracks().forEach((track) => track.stop());

            let buffer = await new Blob(chunks).arrayBuffer();
            let record = await this.context.decodeAudioData(buffer);

            this._recorder = null;

            callback?.(record);
            this.onStateUpdate?.(false);
          }
        };

        this._recorder.start();
        this.startAnalyze();

        // stop at maxDuration
        this._maxDurationTimeoutId = setTimeout(() => {
          this.stop();
        }, maxDuration);
      });
  }

  public stop() {
    clearTimeout(this._maxDurationTimeoutId);
    clearInterval(this._analyzeIntervalId);

    this._recorder?.stop();
  }

  public play(audioBuffer: AudioBuffer) {
    let source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.context.destination);
    source.start();
  }

  public async export(buffers: AudioBuffer[]) {
    // TODO: remove or pad empty audio

    let crucker = new Crunker();
    let buffer = crucker.concatAudio(buffers);

    if (buffer && buffer.length > 0) {
      let exp = await crucker.export(buffer, "audio/mpeg");
      let ele = document.createElement("a");
      ele.href = exp.url;

      // TODO: better export name
      let date = new Date().toISOString().substring(0, 10);
      ele.download = `speech-shadowing-record-${date}.mp3`;
      ele.click();
    }

    crucker.close();
  }
}
