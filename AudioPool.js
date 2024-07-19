export class AudioPool {
  constructor(src, poolSize = 10, maxSounds = 5) {
    this.src = src;
    this.poolSize = poolSize;
    this.maxSounds = maxSounds;
    this.currentSounds = 0;
    this.audioPool = [];
    this.initAudioPool();
  }

  initAudioPool() {
    for (let i = 0; i < this.poolSize; i++) {
      const audio = new Audio(this.src);
      audio.addEventListener('ended', () => {
        this.currentSounds--;
      });
      this.audioPool.push(audio);
    }
  }

  getAudio() {
    for (const audio of this.audioPool) {
      if (audio.paused) {
        return audio;
      }
    }
    return null;
  }

  playSound() {
    if (this.currentSounds < this.maxSounds) {
      const audio = this.getAudio();
      if (audio) {
        this.currentSounds++;
        audio.currentTime = 0;
        audio.play();
      }
    }
  }
}

export default AudioPool;
