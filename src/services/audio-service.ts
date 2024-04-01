import { Mp3Encoder } from "@breezystack/lamejs";

const DomainLength = 20;
const DomainInterval = 50;
const LowDomainThreshold = DomainLength * 1;
const MinLowDomain = 124;
const MaxLowDomain = 132;
const FFTSize = 128;

export default class AudioService {
  private _recorder: MediaRecorder;
  private _ctx: AudioContext;
  private _maxDurationTimeoutId: number;
  private _analyzeIntervalId: number;
  public autoStopRecording: boolean;
  public onStateUpdate: (isRecording: boolean) => void;
  public onDomainDataAvailable: (data: number[]) => void;

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

        if (this.autoStopRecording) {
          let lowDomainCount = 0;

          for (const i of avgDomains) {
            if (i > MinLowDomain && i < MaxLowDomain) {
              lowDomainCount++;
            }
          }

          if (lowDomainCount >= LowDomainThreshold) {
            this.stop();
            if (import.meta.hot) {
              console.log("Stop recording at low domains", avgDomains);
            }
          }
        }
      }

      if (this.onDomainDataAvailable) {
        this.onDomainDataAvailable([...avgDomains]);
      }
    };

    this._analyzeIntervalId = setInterval(analyze, DomainInterval);
  }

  public record(callback: (result: AudioBuffer) => void) {
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

  public async export(buffers: AudioBuffer[]): Promise<Blob> {
    // TODO: remove or pad empty audio

    let numberOfChannels = buffers[0].numberOfChannels;
    let sampleRate = buffers[0].sampleRate;

    let mp3encoder = new Mp3Encoder(numberOfChannels, sampleRate, 128);

    let output: Uint8Array[] = [];
    for (let b of buffers) {
      let bL = new Int16Array(b.getChannelData(0).map(audioFloatToInt16));
      let bR: Int16Array;

      if (numberOfChannels == 2) {
        bR = new Int16Array(b.getChannelData(1).map(audioFloatToInt16));
      }

      let t = mp3encoder.encodeBuffer(bL, bR);
      output.push(t);
    }

    let l = mp3encoder.flush();
    if (l.length > 0) {
      output.push(l);
    }

    return new Blob(output, { type: "audio/mp3" });
  }
}

function audioFloatToInt16(f: number) {
  return f < 0 ? f * 0x8000 : f * 0x7fff;
}
