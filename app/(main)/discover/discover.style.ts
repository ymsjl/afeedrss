import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

export const useStyles = makeStyles({
  container: {
    marginBlockStart: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: tokens.spacingVerticalXL,
    gap: tokens.spacingVerticalXXXL,
  },
  searchBox: {
    width: '100%',
    maxWidth: '600px',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: tokens.spacingHorizontalM,
    width: '100%',
  },
  card: {
    height: '100%',
  },
  icon: {
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
  },
  skeletonCardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalXS,
  }
});
