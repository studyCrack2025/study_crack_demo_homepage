import { MySummaryContent } from './MySummaryContent.jsx';
import { MyProfileHeader } from './MyProfileHeader.jsx';
import { MbtiInsightCard } from './MbtiInsightCard.jsx';
import { MyMenuList } from './MyMenuList.jsx';
import { MyPageOverlays } from './ProfileOverlays.jsx';
import { AppScreenShell } from '../../components/AppScreenShell.jsx';

export function MyPageScreen(ctx) {
  const { dimmed = false, tab = 'my', myPresentation: presentation } = ctx;
  if (!presentation) return null;
  const overlayOpen = Boolean(ctx.profileDetailModalOpen || ctx.mbtiModalOpen);

  return (
    <AppScreenShell
      screen="my"
      tab={tab}
      dimmed={dimmed || overlayOpen}
      overlays={overlayOpen ? <MyPageOverlays {...ctx} /> : null}
    >
          <main className="my-page">
            <MyProfileHeader presentation={presentation} />
            <MbtiInsightCard mbti={presentation.mbti} />
            <MySummaryContent presentation={presentation} />
            <MyMenuList />
          </main>
    </AppScreenShell>
  );
}
