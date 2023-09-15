import { style } from '@vanilla-extract/css';

const styles = style({
  textDecoration: 'none',
  color: 'white',
  ':hover': {
    textDecoration: 'underline',
  },
});
