import { FishArtwork } from '../../screens/aquarium/FishArtwork.jsx';
import { AQUARIUM_SLOTS, normalizeAquariumSlots } from '../../features/gamification/aquarium-presentation.js';

const AQUARIUM_MOTION_PROFILES = new Set(['bottom-drift', 'bottom-pulse', 'dart-loop', 'deep-glide', 'dive-arc', 'fin-drift', 'giant-glide', 'mascot-float', 'ocean-glide', 'pulse-drift', 'reef-loop', 'ribbon-glide', 'round-loop', 'school-loop', 'short-loop', 'vertical-bob', 'vertical-pulse', 'wide-glide']);

function aquariumMotionProfile(meta) {
  const profile = String(meta?.motionProfile || meta?.motion || 'short-loop');
  return AQUARIUM_MOTION_PROFILES.has(profile) ? profile : 'short-loop';
}

function defaultRenderFish(props) {
  return <FishArtwork {...props} variant="pixel" />;
}

export function AquariumScene({ slots = [], catalog = [], selectedFishId = '', stats = null, variant = 'full', renderFish = defaultRenderFish }) {
  const safeVariant = ['full', 'home', 'guide', 'share'].includes(variant) ? variant : 'home';
  const interactive = safeVariant === 'full';
  const showHud = interactive || safeVariant === 'share';
  const fishSlots = normalizeAquariumSlots(slots);
  const planner = stats?.planner;
  return (
    <section className="aquarium-scene" data-scene-variant={safeVariant} aria-label={safeVariant === 'guide' ? '사용법 수조 미리보기' : '나의 공부 수조'}>
      {showHud ? <div className="aquarium-scene-hud"><span><small>연속 학습</small><b>{stats?.streakDays == null ? '확인 필요' : `${stats.streakDays}일`}</b></span><span><small>오늘 계획</small><b>{planner?.status === 'ready' ? `${planner.completed}/${planner.total}` : '확인 필요'}</b></span></div> : null}
      <div className="aquarium-water-line" />
      <div className="aquarium-rays"><i /><i /></div>
      <div className="aquarium-bubbles"><i /><i /><i /><i /></div>
      <div className="aquarium-plants"><i /><i /><i /><i /></div>
      <div className="aquarium-ground"><i /><i /><i /></div>
      {AQUARIUM_SLOTS.map((slot, index) => {
        const fish = fishSlots[index];
        if (!fish) return <span className={`aquarium-empty-slot ${slot.className}`} key={slot.id} />;
        const meta = (Array.isArray(catalog) ? catalog : []).find(item => item?.speciesId === fish.speciesId) || {};
        const colors = Array.isArray(meta.colors) && meta.colors.length >= 2 && meta.colors.every(color => typeof color === 'string' && /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(color)) ? meta.colors : undefined;
        const motionProfile = aquariumMotionProfile(meta);
        const Fish = interactive ? 'button' : 'span';
        return (
          <Fish type={interactive ? 'button' : undefined} role={interactive ? undefined : 'img'} className={`aquarium-fish ${slot.className} ${interactive && selectedFishId === fish.fishId ? 'is-selected' : ''}`} data-action={interactive ? 'selectAquariumFish' : undefined} data-fish-id={fish.fishId} data-motion={motionProfile} aria-label={interactive ? `${fish.name} 선택` : fish.name} key={fish.fishId}>
            <span className="aquarium-fish-path">
              <span className="aquarium-fish-bob"><span className="aquarium-fish-body">{renderFish({ assetKey: fish.assetKey || meta.assetKey, colors, fishId: fish.fishId, growthStage: fish.growthStage, priority: interactive, speciesId: fish.speciesId })}</span></span>
              {interactive ? <span className="aquarium-fish-name">{fish.name}</span> : null}
            </span>
          </Fish>
        );
      })}
    </section>
  );
}
