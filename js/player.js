// Vision Music Web Player
// Static player with real audio files from the Vision Music app

const TRACKS = [
  {
    id: 'markato',
    title: 'Markato',
    artist: 'Ali Birra',
    album: 'Best of Ali Birra',
    cover: 'assets/covers/ali-birra.jpg',
    audio: 'assets/audio/markato.mp3',
    genre: 'Oromo Music',
    tab: 'Popular'
  },
  {
    id: 'hirphaa',
    title: 'Hirphaa',
    artist: 'Hirphaa Gaanfuree',
    album: 'Gaanfuree Vol. 1',
    cover: 'assets/covers/default.png',
    audio: 'assets/audio/hirphaa.mp3',
    genre: 'Oromo Music',
    tab: 'Popular'
  },
  {
    id: 'yosan_getahun',
    title: '3Obsaa',
    artist: 'Yosan Getahun',
    album: 'Single',
    cover: 'assets/covers/yosan-getahun.jpg',
    audio: 'assets/audio/yosan_getahun.mp3',
    genre: 'Oromo Music',
    tab: 'Recently'
  },
  {
    id: 'lagaa',
    title: 'Lagaa',
    artist: 'Davo',
    album: 'Single',
    cover: 'assets/covers/davo.jpg',
    audio: 'assets/audio/lagaa.mp3',
    genre: 'Oromo Music',
    tab: 'Trending'
  },
  {
    id: 'shagoye',
    title: 'Marartuu',
    artist: 'Shukri Jamal',
    album: 'Single',
    cover: 'assets/covers/shukri-jamal.jpg',
    audio: 'assets/audio/shagoye.mp3',
    genre: 'Oromo Music',
    tab: 'Similar'
  },
  {
    id: 'kuyubisaa',
    title: 'Kuyubisaa',
    artist: 'Asanti',
    album: 'Asanti Gold',
    cover: 'assets/covers/asanti.jpg',
    audio: 'assets/audio/kuyubisaa.mp3',
    genre: 'Oromo Music',
    tab: 'Trending'
  },
  {
    id: 'alibiyyanqabaa',
    title: 'Alibiyyanqabaa',
    artist: 'Naaima Abdurahman',
    album: 'Single',
    cover: 'assets/covers/naaima-abdurahman.jpg',
    audio: 'assets/audio/alibiyyanqabaa.mp3',
    genre: 'Oromo Music',
    tab: 'Recently'
  },
  {
    id: 'andualem_gosa',
    title: 'Gumgume',
    artist: 'Andualem Gosa',
    album: 'Single',
    cover: 'assets/covers/andualem-gosa.jpg',
    audio: 'assets/audio/gungume.mp3',
    genre: 'Oromo Music',
    tab: 'Popular'
  },
  {
    id: 'daraara',
    title: 'Daraara Laga',
    artist: 'Ali Birra',
    album: 'Single',
    cover: 'assets/covers/ali-birra.jpg',
    audio: 'assets/audio/daraara-lagaa.mp3',
    genre: 'Oromo Music',
    tab: 'Similar'
  }
];

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 = off, 1 = all, 2 = one
let queue = [...TRACKS];
let activeTab = 'All';

const audio = new Audio();
audio.preload = 'metadata';

// DOM Elements
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const queueBtn = document.getElementById('queue-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const tracksGrid = document.getElementById('tracks-grid');
const queuePanel = document.getElementById('queue-panel');
const queueList = document.getElementById('queue-list');
const closeQueueBtn = document.getElementById('close-queue');
const tabButtons = document.querySelectorAll('.tab-btn');

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function loadTrack(index) {
  if (index < 0 || index >= queue.length) return;
  currentIndex = index;
  const track = queue[index];
  audio.src = track.audio;
  playerCover.src = track.cover;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;
  document.title = `${track.title} · ${track.artist} — Vision Music`;
  updateQueueHighlight();
}

function playTrack(index) {
  loadTrack(index);
  audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
  }).catch(err => {
    console.log('Playback error:', err);
    showToast('Unable to play audio. Try again.');
  });
}

function togglePlay() {
  if (!audio.src) loadTrack(0);
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play().then(() => {
      isPlaying = true;
    }).catch(err => {
      console.log('Playback error:', err);
      showToast('Unable to play audio.');
    });
  }
  updatePlayButton();
}

function updatePlayButton() {
  if (!playBtn) return;
  playBtn.innerHTML = isPlaying
    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
}

function nextTrack() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * queue.length);
  } else {
    currentIndex = (currentIndex + 1) % queue.length;
  }
  playTrack(currentIndex);
}

function prevTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  currentIndex = (currentIndex - 1 + queue.length) % queue.length;
  playTrack(currentIndex);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
}

function cycleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  const icons = ['↻', '↻', '↻'];
  const labels = ['Off', 'All', 'One'];
  repeatBtn.innerHTML = `<span>${repeatMode === 2 ? '↻₁' : '↻'}</span>`;
  repeatBtn.classList.toggle('active', repeatMode !== 0);
}

function updateProgress() {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = percent + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
}

function seekTrack(e) {
  const rect = progressContainer.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
}

function setVolume(value) {
  audio.volume = value;
}

function toggleQueue() {
  queuePanel.classList.toggle('open');
  renderQueue();
}

function renderQueue() {
  if (!queueList) return;
  queueList.innerHTML = queue.map((track, i) => `
    <div class="queue-item ${i === currentIndex ? 'active' : ''}" data-index="${i}">
      <img src="${track.cover}" alt="" class="queue-thumb">
      <div class="queue-info">
        <div class="queue-title">${track.title}</div>
        <div class="queue-artist">${track.artist}</div>
      </div>
      ${i === currentIndex ? '<span class="queue-playing">▶</span>' : ''}
    </div>
  `).join('');

  queueList.querySelectorAll('.queue-item').forEach(item => {
    item.addEventListener('click', () => {
      playTrack(parseInt(item.dataset.index));
    });
  });
}

function updateQueueHighlight() {
  renderQueue();
}

function renderTracks() {
  if (!tracksGrid) return;
  const filtered = activeTab === 'All' ? TRACKS : TRACKS.filter(t => t.tab === activeTab);
  tracksGrid.innerHTML = filtered.map((track, i) => `
    <article class="track-card" data-index="${TRACKS.indexOf(track)}">
      <div class="track-cover-wrap">
        <img src="${track.cover}" alt="${track.title}" class="track-cover">
        <button class="track-play-btn" aria-label="Play ${track.title}">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <h3 class="track-title">${track.title}</h3>
      <p class="track-artist">${track.artist}</p>
    </article>
  `).join('');

  tracksGrid.querySelectorAll('.track-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.track-play-btn')) {
        const idx = parseInt(card.dataset.index);
        playTrack(idx);
      }
    });
  });
}

function setDiscoverTab(tabName) {
  activeTab = tabName;
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  renderTracks();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Event Listeners
if (playBtn) playBtn.addEventListener('click', togglePlay);
if (prevBtn) prevBtn.addEventListener('click', prevTrack);
if (nextBtn) nextBtn.addEventListener('click', nextTrack);
if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
if (repeatBtn) repeatBtn.addEventListener('click', cycleRepeat);
if (queueBtn) queueBtn.addEventListener('click', toggleQueue);
if (closeQueueBtn) closeQueueBtn.addEventListener('click', toggleQueue);

if (progressContainer) {
  progressContainer.addEventListener('click', seekTrack);
}

if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
}

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextTrack();
  }
});
audio.addEventListener('loadedmetadata', updateProgress);

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => setDiscoverTab(btn.dataset.tab));
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    togglePlay();
  }
  if (e.code === 'ArrowRight' && e.ctrlKey) nextTrack();
  if (e.code === 'ArrowLeft' && e.ctrlKey) prevTrack();
});

// Initialize
renderTracks();
loadTrack(0);
updatePlayButton();

// Mobile nav toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
if (mobileMenuBtn && mobileNav) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}
