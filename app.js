const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const releaseLoadingState = () => {
  document.body.classList.remove('is-loading');
  document.documentElement.classList.remove('is-loading');
  window.removeEventListener('wheel', preventLoadingScroll);
  window.removeEventListener('touchmove', preventLoadingScroll);
  window.removeEventListener('keydown', preventLoadingKeyScroll);
};
const shouldShowLoader = !reducedMotion && window.gsap;
if (shouldShowLoader) {
  document.body.classList.add('is-loading');
  document.documentElement.classList.add('is-loading');
}

const loadingScrollKeys = new Set([' ', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const preventLoadingScroll = (event) => {
  if (document.documentElement.classList.contains('is-loading')) event.preventDefault();
};
const preventLoadingKeyScroll = (event) => {
  if (document.documentElement.classList.contains('is-loading') && loadingScrollKeys.has(event.key)) event.preventDefault();
};
window.addEventListener('wheel', preventLoadingScroll, { passive:false });
window.addEventListener('touchmove', preventLoadingScroll, { passive:false });
window.addEventListener('keydown', preventLoadingKeyScroll);

if (shouldShowLoader) {
  const counter = document.querySelector('.loader-count');
  const count = { value: 0 };
  const progressLine = document.querySelector('.loader-line i');
  const randomBetween = (min, max) => Math.round(min + Math.random() * (max - min));
  const loaderDuration = (duration) => duration * .81;
  const progressStops = [randomBetween(12, 28), randomBetween(40, 62), randomBetween(76, 94), 100];
  const loaderTimeline = gsap.timeline({ onComplete: releaseLoadingState });
  const updateLoaderProgress = () => { counter.textContent = String(Math.round(count.value)).padStart(2, '0'); };
  let previousStop = 0;
  progressStops.forEach((stop, index) => {
    const isStuckStop = index < progressStops.length - 1;
    const trickleStart = isStuckStop ? Math.max(previousStop, stop - randomBetween(2, 4)) : previousStop;
    if (!isStuckStop) {
      const finishDuration = loaderDuration(randomBetween(14, 22) / 100);
      loaderTimeline
        .to(count, { value: stop, duration: finishDuration, ease: 'power2.out', onUpdate: updateLoaderProgress })
        .to(progressLine, { scaleX: stop / 100, duration: finishDuration, ease: 'power2.out' }, '<');
    } else if (trickleStart > previousStop) {
      const travelDuration = loaderDuration(randomBetween(19, 33) / 100);
      loaderTimeline
        .to(count, { value: trickleStart, duration: travelDuration, ease: index % 2 ? 'power1.inOut' : 'power2.out', onUpdate: updateLoaderProgress })
        .to(progressLine, { scaleX: trickleStart / 100, duration: travelDuration, ease: 'power2.out' }, '<');
    }
    if (isStuckStop) {
      for (let value = trickleStart + 1; value <= stop; value += 1) {
        const stepDuration = loaderDuration(randomBetween(2, 4) / 100);
        loaderTimeline
          .to(count, { value, duration: stepDuration, ease: 'none', onUpdate: updateLoaderProgress })
          .to(progressLine, { scaleX: value / 100, duration: stepDuration, ease: 'none' }, '<');
      }
    }
    if (index < progressStops.length - 1) loaderTimeline.to({}, { duration: loaderDuration(randomBetween(8, 18) / 100) });
    previousStop = stop;
  });
  loaderTimeline
    .to('.loader-name span:first-child', { yPercent: -105, duration: loaderDuration(.75), ease: 'power3.inOut' }, `+=${loaderDuration(.08)}`)
    .to('.loader-name span:last-child', { yPercent: 105, duration: loaderDuration(.75), ease: 'power3.inOut' }, '<')
    .to('.loader', { yPercent: -100, duration: loaderDuration(.85), ease: 'power3.inOut' }, `-=${loaderDuration(.35)}`);
} else {
  document.querySelector('.loader')?.remove();
  releaseLoadingState();
}

const projectDetails = {
  new: {
    kicker: "Things I've built / 01",
    count: '01 / 03',
    title: 'VODCoach',
    summary: 'A VOD review workspace built around the moments worth revisiting.',
    stack: 'React.js, TypeScript, Go, FFmpeg, Cloudflare R2, Redpanda',
    year: '2026',
    media: 'video',
    mockup: 'VODCoach Studio',
    description: 'The idea came from hitting Challenger in TFT and wanting a better way to review the moments behind each game. VODCoach became a full-stack platform with timestamped notes, on-video drawings, and shareable review links, powered by an event-driven Go pipeline with FFmpeg, Cloudflare R2, and Redpanda workers.',
    link: 'https://vod-coach.vercel.app',
    github: 'https://github.com/bnquon/VodCoach',
  },
  intervu: {
    kicker: "Things I've built / 02",
    count: '02 / 03',
    title: 'IntervU',
    summary: 'An AI mock interview platform for practicing before the real thing.',
    stack: 'Go, Gemini, React.js, Vercel, Render',
    year: '2025',
    media: null,
    mockup: 'IntervU walkthrough',
    description: 'I came up with the backend architecture and led the development of IntervU, including the API routes, session handling, and browser workflow connecting behavioral and technical interview practice. Built for StormHacks 2025, it placed top three out of 220 projects and won collectively a $2,500 prize.',
    link: 'https://devpost.com/software/intervu-852wre',
  },
  jobscura: {
    kicker: "Things I've built / 03",
    count: '03 / 03',
    title: 'Jobscura',
    summary: 'A (discontinued) Chrome extension that makes LinkedIn job postings a little less opaque.',
    stack: 'Chrome extension, JavaScript',
    year: '2025',
    media: null,
    mockup: 'Jobscura',
    description: 'Jobscura surfaces views, applications, and expiry details that are easy to miss using an API call buried in the network calls. It reached 450+ installs and was used across more than 20,000 job postings.',
    link: 'https://github.com/bnquon/linkedin-job-counter',
  },
};

const projectPage = document.querySelector('#project-page');
const projectPageFields = {
  kicker: document.querySelector('#project-page-kicker'),
  count: document.querySelector('#project-page-count'),
  title: document.querySelector('#project-page-title'),
  summary: document.querySelector('#project-page-summary'),
  stack: document.querySelector('#project-page-stack'),
  year: document.querySelector('#project-page-year'),
  description: document.querySelector('#project-page-description'),
  link: document.querySelector('#project-page-link'),
  github: document.querySelector('#project-page-github'),
};
const projectNext = document.querySelector('#project-page-next');
const projectMediaWindow = document.querySelector('#project-page-media');
const projectLinksLabel = document.querySelector('#project-page-links-label');
const projectOrder = ['new', 'intervu', 'jobscura'];
let projectCloseTimer;
let projectSwapTimer;
let lastProjectTrigger = null;
let projectReturnScrollY = 0;
let hasProjectReturnPosition = false;
const originalTitle = document.title;

const fillProjectPage = (key) => {
  const project = projectDetails[key];
  if (!project) return false;
  Object.entries(projectPageFields).forEach(([field, element]) => {
    if (field === 'link') return;
    element.textContent = project[field];
  });
  projectPageFields.link.hidden = !project.link;
  projectPageFields.github.hidden = !project.github;
  projectLinksLabel.hidden = !project.link && !project.github;
  if (project.link) {
    projectPageFields.link.href = project.link;
    projectPageFields.link.textContent = 'View project ↗';
  }
  if (project.github) {
    projectPageFields.github.href = project.github;
    projectPageFields.github.textContent = 'GitHub ↗';
  }
  const hasMedia = project.media === 'video';
  projectMediaWindow.hidden = !hasMedia;
  projectPage.classList.toggle('project-page--no-media', !hasMedia);
  projectPage.classList.toggle('project-page--has-media', hasMedia);
  const nextKey = projectOrder[(projectOrder.indexOf(key) + 1) % projectOrder.length];
  const nextProject = projectDetails[nextKey];
  projectNext.href = `#project-${nextKey}`;
  projectNext.dataset.project = nextKey;
  projectNext.textContent = `Next / ${nextProject.title} ↗`;
  document.title = `${project.title} — Brandon Quon`;
  return true;
};

const openProject = (key, updateHistory = true, trigger = null) => {
  if (!projectDetails[key]) return;
  window.clearTimeout(projectCloseTimer);
  window.clearTimeout(projectSwapTimer);
  lastProjectTrigger = trigger || lastProjectTrigger;
  const isProjectSwap = !projectPage.hidden && projectPage.classList.contains('is-visible');
  if (updateHistory) {
    projectReturnScrollY = window.scrollY;
    hasProjectReturnPosition = true;
    history.pushState({ project: key }, '', `#project-${key}`);
  }
  if (isProjectSwap) {
    if (reducedMotion) {
      fillProjectPage(key);
      projectPage.scrollTop = 0;
      return;
    }
    projectPage.classList.add('is-swapping');
    projectSwapTimer = window.setTimeout(() => {
      fillProjectPage(key);
      projectPage.scrollTop = 0;
      projectPage.classList.remove('is-swapping');
      projectPage.classList.add('is-swapping-in');
      requestAnimationFrame(() => projectPage.classList.remove('is-swapping-in'));
    }, 180);
    return;
  }
  fillProjectPage(key);
  projectPage.hidden = false;
  projectPage.scrollTop = 0;
  document.body.classList.add('is-project-open');
  document.documentElement.classList.add('is-project-open');
  requestAnimationFrame(() => {
    projectPage.classList.add('is-visible');
    projectPage.focus({ preventScroll: true });
  });
};

const closeProject = (returnToWork = false, updateHistory = true) => {
  if (projectPage.hidden) return;
  window.clearTimeout(projectSwapTimer);
  projectPage.classList.remove('is-swapping', 'is-swapping-in');
  projectPage.classList.remove('is-visible');
  document.body.classList.remove('is-project-open');
  if (updateHistory) history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
  const finishClose = () => {
    projectPage.hidden = true;
    document.documentElement.classList.remove('is-project-open');
    document.title = originalTitle;
    if ((returnToWork || !updateHistory) && hasProjectReturnPosition) {
      window.scrollTo({ top: projectReturnScrollY, behavior: reducedMotion ? 'auto' : 'smooth' });
      hasProjectReturnPosition = false;
    }
    lastProjectTrigger?.focus({ preventScroll: true });
  };
  projectCloseTimer = window.setTimeout(finishClose, reducedMotion ? 0 : 550);
};

const syncProjectFromHash = () => {
  const key = window.location.hash.replace('#project-', '');
  if (projectDetails[key]) openProject(key, false);
  else if (!projectPage.hidden) closeProject(false, false);
};

const scrollToHashTarget = (hash, behavior = "auto") => {
  const target = document.querySelector(hash || "#top");
  target?.scrollIntoView({ behavior });
};

const handleHistoryNavigation = () => {
  const isProjectHash = window.location.hash.startsWith("#project-");
  syncProjectFromHash();
  if (!isProjectHash && projectPage.hidden) scrollToHashTarget(window.location.hash);
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.dataset.project) {
      event.preventDefault();
      openProject(link.dataset.project, true, link);
      return;
    }
    if (link.hasAttribute('data-project-close')) {
      event.preventDefault();
      closeProject(true);
      return;
    }
    const hash = link.getAttribute('href');
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    if (window.location.hash !== hash) history.pushState({}, '', hash);
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

window.addEventListener('popstate', handleHistoryNavigation);
window.addEventListener('hashchange', handleHistoryNavigation);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !projectPage.hidden) closeProject(true);
});
handleHistoryNavigation();

const sections = [...document.querySelectorAll('[data-section]')];
const railLinks = [...document.querySelectorAll('.section-rail a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    railLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-42% 0px -48%' });
sections.forEach((section) => sectionObserver.observe(section));

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const themeButton = document.querySelector('.theme-toggle');
const themeLabel = themeButton.querySelector('span');
const heroImage = document.querySelector('#hero-image');
const musicAudio = document.querySelector('#music-audio');
const musicPlay = document.querySelector('.music-player-play');
const musicTitle = document.querySelector('.music-player-title');
const musicCurrent = document.querySelector('.music-player-time');
const musicDuration = document.querySelector('.music-player-duration');
const musicProgress = document.querySelector('#music-seek');
const musicVolume = document.querySelector('#music-volume');
const musicTracks = {
  light: { title: 'Whirling-in-Rags, 8 AM', src: 'music/Whirling-In-Rags%2C%208%20AM.mp3' },
  dark: { title: 'Whirling-in-Rags, 12 PM', src: 'music/Whirling-In-Rags%2C%2012%20PM.mp3' },
};
const formatMusicTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};
const syncMusicVolume = () => {
  const volume = Number(musicVolume.value);
  musicAudio.volume = volume;
  musicVolume.style.setProperty('--volume', `${volume * 100}%`);
};
const updateMusicTrack = (theme) => {
  const track = musicTracks[theme];
  if (!musicAudio || !track) return;
  musicAudio.pause();
  musicAudio.currentTime = 0;
  musicAudio.src = track.src;
  syncMusicVolume();
  musicAudio.load();
  musicTitle.textContent = track.title;
  musicCurrent.textContent = '0:00';
  musicDuration.textContent = '--:--';
  musicProgress.max = '0';
  musicProgress.value = '0';
  musicProgress.style.setProperty('--progress', '0%');
  musicProgress.disabled = true;
  musicPlay.textContent = '▶';
  musicPlay.setAttribute('aria-label', 'Play track');
};
const updateThemeAssets = (theme) => {
  if (!heroImage) return;
  heroImage.src = theme === 'light' ? heroImage.dataset.lightSrc : heroImage.dataset.darkSrc;
};
let savedTheme = null;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch {}
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const initialTheme = savedTheme || systemTheme;
document.documentElement.dataset.theme = initialTheme;
updateThemeAssets(initialTheme);
updateMusicTrack(initialTheme);
themeLabel.textContent = initialTheme === 'dark' ? 'Light' : 'Dark';

musicPlay.addEventListener('click', async () => {
  if (musicAudio.paused) {
    try { await musicAudio.play(); } catch {}
  } else {
    musicAudio.pause();
  }
});
musicVolume.addEventListener('input', syncMusicVolume);
musicAudio.addEventListener('loadedmetadata', () => {
  musicDuration.textContent = formatMusicTime(musicAudio.duration);
  musicProgress.max = musicAudio.duration;
  musicProgress.disabled = false;
});
musicAudio.addEventListener('timeupdate', () => {
  musicCurrent.textContent = formatMusicTime(musicAudio.currentTime);
  const progress = musicAudio.duration ? (musicAudio.currentTime / musicAudio.duration) * 100 : 0;
  musicProgress.value = musicAudio.currentTime;
  musicProgress.style.setProperty('--progress', `${progress}%`);
});
musicProgress.addEventListener('input', () => {
  musicAudio.currentTime = Number(musicProgress.value);
});
musicAudio.addEventListener('play', () => {
  musicPlay.textContent = 'Ⅱ';
  musicPlay.setAttribute('aria-label', 'Pause track');
});
musicAudio.addEventListener('pause', () => {
  musicPlay.textContent = '▶';
  musicPlay.setAttribute('aria-label', 'Play track');
});
musicAudio.addEventListener('ended', () => {
  musicAudio.currentTime = 0;
  musicProgress.value = 0;
  musicProgress.style.setProperty('--progress', '0%');
});

themeButton.addEventListener('click', (event) => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  const applyTheme = () => {
    document.documentElement.dataset.theme = nextTheme;
    updateThemeAssets(nextTheme);
    updateMusicTrack(nextTheme);
    themeLabel.textContent = nextTheme === 'dark' ? 'Light' : 'Dark';
    try { localStorage.setItem('portfolio-theme', nextTheme); } catch {}
  };
  if (reducedMotion || !document.startViewTransition) return applyTheme();
  const x = event.clientX;
  const y = event.clientY;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(applyTheme);
  transition.ready.then(() => document.documentElement.animate({ clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`] }, { duration:650, easing:'cubic-bezier(.16,1,.3,1)', pseudoElement:'::view-transition-new(root)' }));
});
