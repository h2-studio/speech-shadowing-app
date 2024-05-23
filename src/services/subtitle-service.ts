import * as ssp from "simple-subtitle-parser";

export default class SubtitleService {
  async parseSubtitle(url: string): Promise<SubtitleLine[]> {
    let res = await fetch(url);
    let text = await res.text();
    text = text.trim();

    if (text.startsWith("[") && text.endsWith("]")) {
      // json
      return this.privateJsonSubtitle(text);
    } else {
      // srt or vtt
      return await this.privateTextSubtitle(text);
    }
  }

  private privateJsonSubtitle(input: string) {
    let lines = JSON.parse(input) as SubtitleLine[];
    let lastLineIndex = lines.length - 1;

    lines.forEach((line, index) => {
      line.index = index;
      line.duration = line.end - line.start;
      line.isFirstLine = index == 0;
      line.isLastLine = index == lastLineIndex;

      // TODO: on/off by the setting
      if (line.phonetics) {
        let text = line.text;
        let html = text;
        let offset = 0;

        for (let phonetic of line.phonetics) {
          let [start, length, ipa] = phonetic;
          let end = start + length;
          let word = text.slice(start, end);
          let ruby = `<ruby>${word}<rt>/${ipa}/</rt></ruby>`;

          // adjust with offset;
          start = start + offset;
          end = start + length;

          html = html.slice(0, start) + ruby + html.slice(end);

          offset = offset + ruby.length - length;
        }

        line.html = html;
      }
    });

    return lines;
  }

  private async privateTextSubtitle(input: string) {
    // the library only support \n
    input = input.replaceAll("\r\n", "\n");

    let format = (input.startsWith("WEBVTT") ? "WEBVTT" : "SRT") as ssp.Format;

    let cues = await ssp.parser(format, input);
    let lastLineIndex = cues.length - 1;
    return cues.map(
      (cue) =>
        ({
          index: cue.sequence,
          start: cue.startTime.totals.inSeconds,
          end: cue.endTime.totals.inSeconds,
          duration:
            cue.endTime.totals.inSeconds - cue.startTime.totals.inSeconds,
          text: cue.text.join(" "),
          isFirstLine: cue.sequence == 0,
          isLastLine: cue.sequence == lastLineIndex,
        } as SubtitleLine)
    );
  }
}
