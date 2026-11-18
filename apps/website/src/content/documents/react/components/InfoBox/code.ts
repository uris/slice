export const profileCode = `import { Avatar, Icon, InfoBox, InfoBoxAction, InfoBoxContent, InfoBoxImage, InfoBoxTitle } from '@apple-pie/slice';

<InfoBox maxWidth={420} style={{ width: '100%' }} onPress={openProfile}>
  <InfoBoxImage>
    <Avatar name="John Wick" image="/images/jw-profile.png" />
  </InfoBoxImage>
  <InfoBoxTitle title="John Wick" />
  <InfoBoxContent text="View John Wick's profile." />
  <InfoBoxAction>
    <Icon name="arrows.chevron-right" aria-hidden="true" />
  </InfoBoxAction>
</InfoBox>`;
export const actionCode = `<InfoBox maxWidth={420} style={{ width: '100%' }}>
  <InfoBoxImage><Avatar name="John Wick" image="/images/jw-profile.png" /></InfoBoxImage>
  <InfoBoxTitle title="John Wick" />
  <InfoBoxContent text="View John Wick's profile." />
  <InfoBoxAction button={{ label: 'View', variant: 'secondary', onClick: openProfile }} />
</InfoBox>`;
export const compactCode = `<InfoBox maxWidth={420} style={{ width: '100%' }}>
  <InfoBoxImage><Avatar name="John Wick" image="/images/jw-profile.png" /></InfoBoxImage>
  <InfoBoxTitle title="John Wick" />
  <InfoBoxAction button={{ label: 'View', variant: 'secondary', onClick: openProfile }} />
</InfoBox>`;
export const simpleCode = `<InfoBox maxWidth={420} style={{ width: '100%' }}>
  <InfoBoxTitle title="Discover the new features" />
  <InfoBoxContent text="Over 100 features added." />
  <InfoBoxAction button={{ label: 'Follow updates', variant: 'outline', onClick: followUpdates }} />
</InfoBox>`;
