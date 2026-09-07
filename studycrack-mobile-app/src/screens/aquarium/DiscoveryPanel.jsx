import { useState } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { FishArtwork } from './FishArtwork.jsx';
import { AquariumModeHeader, catalogMeta, RARITY_CLASSES, RARITY_LABELS } from './aquarium-panel-shared.jsx';
const DRAW_STEP_CLASSES = ['step-0', 'step-1', 'step-2', 'step-3'];
function playAquariumRevealSound(rarity = 'common') {
  try {
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const notes = rarity === 'special' ? [659, 784, 988, 1318, 1568] : rarity === 'legendary' ? [392, 523, 659, 784, 1046] : rarity === 'epic' ? [523, 659, 784, 1046] : rarity === 'rare' ? [523, 659, 784] : [523, 659];
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.065, context.currentTime + 0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.35);
    master.connect(context.destination);
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * 0.11;
      oscillator.type = index % 2 ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.7, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      oscillator.connect(gain).connect(master);
      oscillator.start(start);
      oscillator.stop(start + 0.46);
    });
    void context.resume();
    globalThis.setTimeout(() => void context.close(), 1500);
  } catch {
    // Audio is enhancement-only; browser restrictions must not interrupt the reward flow.
  }
}


function DrawPity({ profile }) {
  const rareIn = Math.max(0, Number(profile?.drawPity?.rareIn) || 0);
  const epicIn = Math.max(0, Number(profile?.drawPity?.epicIn) || 0);
  const legendaryIn = Math.max(0, Number(profile?.drawPity?.legendaryIn) || 0);
  return <div className="aquarium-pity"><div><span>희귀 확정</span><b>{rareIn ? `${rareIn}회 후` : '이번 뽑기'}</b></div><div><span>영웅 확정</span><b>{epicIn ? `${epicIn}회 후` : '이번 뽑기'}</b></div><div><span>전설 확정</span><b>{legendaryIn ? `${legendaryIn}회 후` : '이번 뽑기'}</b></div></div>;
}

function DrawResult({ actionError, actionStatus, catalog, pendingDraw }) {
  const { fish, result } = pendingDraw;
  const meta = catalogMeta(catalog, fish.speciesId);
  const duplicate = Boolean(result.duplicate);
  const rarity = result.rarity || 'common';
  const discoveryCopy = rarity === 'special' ? '특별한 여정의 친구가 합류했어요' : rarity === 'legendary' ? '전설적인 친구가 수조에 합류했어요' : rarity === 'epic' ? '특별한 친구가 수조에 합류했어요' : '새 물고기가 수조에 합류했어요';
  return <section className={`aquarium-draw-result ${RARITY_CLASSES[rarity] || RARITY_CLASSES.common}`} aria-live="polite"><div className="aquarium-result-burst" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i style={{ '--particle-index': index }} key={index} />)}</div><span>{duplicate ? '다시 만난 친구' : `${RARITY_LABELS[rarity] || '일반'} 물고기 발견`}</span><div className="aquarium-result-halo"><i className="aquarium-result-ring" aria-hidden="true" /><FishArtwork assetKey={meta.assetKey} colors={meta.colors} fishId={fish.fishId} growthStage={fish.growthStage} priority speciesId={fish.speciesId} variant="detail" /></div><h2>{meta.displayName}</h2><p>{fish.name} · {RARITY_LABELS[rarity] || '일반'}</p><div className="aquarium-result-reward">{duplicate ? <><span>중복 성장 보상</span><b>EXP +{Number(result.expGranted) || 0}</b>{Number(result.shellsRefunded) > 0 ? <small>최대 레벨 보상으로 조개 {result.shellsRefunded}개를 돌려받았어요.</small> : <small>기존 물고기의 성장 경험치로 합쳐졌어요.</small>}</> : <><span>도감 등록 완료</span><b>{discoveryCopy}</b><small>도감에서 생김새와 성장 상태를 다시 확인할 수 있어요.</small></>}</div>{actionError ? <p className="aquarium-action-error" role="alert">{actionError}</p> : null}<button type="button" className="btn btn-primary" data-action="acknowledgeAquariumDraw" data-target="catalog" disabled={actionStatus === 'acknowledging-draw'}>{actionStatus === 'acknowledging-draw' ? '결과를 저장하는 중...' : '도감에서 확인하기'}</button></section>;
}

export function DiscoveryPanel({ actionError = '', actionStatus = 'idle', catalog = [], pendingDraw = null, pendingDrawError = '', pendingDrawStatus = 'idle', profile, revealStep = 0 }) {
  const [soundOn, setSoundOn] = useState(true);
  const drawing = actionStatus === 'drawing';
  const rarity = pendingDraw?.result?.rarity || 'common';
  if (pendingDraw && revealStep >= 3) return <div className="aquarium-mode-shell aquarium-draw-view"><AquariumModeHeader eyebrow="DISCOVERY" title="새로운 만남" description="오늘의 공부가 데려온 친구를 확인해보세요." /><DrawResult actionError={actionError} actionStatus={actionStatus} catalog={catalog} pendingDraw={pendingDraw} /></div>;
  return <div className="aquarium-mode-shell aquarium-draw-view">
    <AquariumModeHeader eyebrow="DISCOVERY" title="새로운 친구 만나기" description="공부로 모은 조개를 열어 수조의 다음 친구를 발견해보세요." />
    <DrawPity profile={profile} />
    {pendingDraw ? <section className={`aquarium-draw-box ${DRAW_STEP_CLASSES[revealStep] || DRAW_STEP_CLASSES[0]}`}><div className="aquarium-draw-light" /><button type="button" className="aquarium-sound-toggle" aria-label={soundOn ? '축하 효과음 끄기' : '축하 효과음 켜기'} onClick={() => setSoundOn((enabled) => !enabled)}><Icon name={soundOn ? 'bell' : 'alert'} /></button><button type="button" data-action="advanceAquariumDrawReveal" aria-label={`상자 열기 ${revealStep + 1}단계`} onClick={() => { if (soundOn && revealStep === 2) playAquariumRevealSound(rarity); }}><span className="aquarium-chest"><i /><b /></span></button><span>오늘의 공부 보상</span><h2>{revealStep === 0 ? '상자를 세 번 눌러주세요' : revealStep === 1 ? '안에서 움직임이 느껴져요' : '마지막으로 한 번 더!'}</h2><p>{3 - revealStep}번 더 누르면 새로운 친구가 나타나요.</p></section> : <section className="aquarium-draw-ready"><div className="aquarium-sealed-chest"><i /><b /></div><span>DISCOVERY</span><h2>어떤 친구가 기다리고 있을까요?</h2><p>결과는 서버에서 먼저 확정돼요. 중간에 나가도 같은 결과를 이어서 확인할 수 있습니다.</p><div className="aquarium-draw-cost"><span>보유 조개</span><b>{Number(profile?.shellBalance) || 0}</b><i /><span>필요 조개</span><b>30</b></div>{pendingDrawError ? <p className="aquarium-action-error" role="alert">{pendingDrawError}</p> : null}{actionError ? <p className="aquarium-action-error" role="alert">{actionError}</p> : null}<button type="button" className="btn btn-primary" data-action="startAquariumDraw" disabled={drawing || pendingDrawStatus !== 'ready' || Number(profile?.shellBalance) < 30}>{drawing ? '결과를 확정하는 중...' : Number(profile?.shellBalance) < 30 ? '조개가 더 필요해요' : '조개 30개로 만나기'}</button></section>}
  </div>;
}

