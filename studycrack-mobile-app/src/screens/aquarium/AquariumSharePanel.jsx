import { AquariumScene } from '../../components/aquarium/AquariumScene.jsx';
import { aquariumCollectionLabel } from '../../features/gamification/aquarium-presentation.js';
import { Icon } from '../../components/Icon.jsx';
import { AquariumModeHeader } from './aquarium-panel-shared.jsx';

export function AquariumSharePanel({ actionError = '', actionStatus = 'idle', catalog = [], snapshot, result }) {
  const shared = result?.type === 'share';
  return <div className="aquarium-mode-shell aquarium-share-view">
    <AquariumModeHeader eyebrow="SHARE" title="나의 공부 수조" description="성적이나 계정 정보 없이 공부로 만든 기록만 공유해요." />
    <section className="aquarium-share-card">
      <div className="aquarium-share-brand"><Icon name="fish" /><span><b>StudyCrack Aquarium</b><small>공부가 쌓일수록 수조도 자라요</small></span></div>
      <AquariumScene slots={snapshot.slots} catalog={catalog} stats={snapshot} variant="share" />
      <div className="aquarium-share-stats"><div><span>발견한 물고기</span><b>{aquariumCollectionLabel(snapshot)}</b></div><div><span>연속 학습</span><b>{snapshot.streakDays === null ? '확인 필요' : `${snapshot.streakDays}일`}</b></div><div><span>함께 헤엄치는 친구</span><b>{snapshot.activeCount === null ? '확인 필요' : `${snapshot.activeCount}마리`}</b></div></div>
      <p>개인정보와 입시 성적은 공유 카드에 포함되지 않습니다.</p>
    </section>
    {shared ? <div className="aquarium-share-result" role="status"><Icon name="check" /><span>{result.method === 'clipboard' ? '공유 문구와 링크를 복사했어요.' : '수조 공유를 완료했어요.'}</span></div> : null}
    {actionError ? <p className="aquarium-action-error" role="alert">{actionError}</p> : null}
    <button type="button" className="btn btn-primary aquarium-share-submit" data-action="shareAquarium" disabled={actionStatus === 'sharing'}><Icon name="share" />{actionStatus === 'sharing' ? '공유 화면을 여는 중...' : shared ? '다시 공유하기' : '수조 공유하기'}</button>
  </div>;
}

