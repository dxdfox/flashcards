class AnimationPlayer {
  constructor(frames, interval = 1000) {
    this.frames = frames;
    this.interval = interval;
    this.currentFrame = 0;
    this.isPlaying = false;
    this.timer = null;
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.play();
    }
  }

  stop() {
    this.isPlaying = false;
    this.currentFrame = 0;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  play() {
    if (!this.isPlaying) return;

    this.timer = setTimeout(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.play();
    }, this.interval);
  }

  getCurrentFrame() {
    return this.frames[this.currentFrame];
  }
}

export default AnimationPlayer;
