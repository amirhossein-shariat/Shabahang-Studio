/** Site-wide switches. Flip a flag instead of deleting code. */
export const FEATURES: { showWork: boolean; showLogin: boolean } = {
  /** Portfolio pages (/work, /work/[category]), nav link, home section and hero button. Hidden until real projects exist. */
  showWork: false,
  /** Sign-in page and the header link. The form is design-only until the user system exists. */
  showLogin: true,
};
