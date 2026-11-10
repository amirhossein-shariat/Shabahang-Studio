/** Site-wide switches. Flip a flag instead of deleting code. */
export const FEATURES: { showWork: boolean; showLogin: boolean; demoPanel: boolean } = {
  /** Portfolio pages (/work, /work/[category]), nav link, home section and hero button. Hidden until real projects exist. */
  showWork: false,
  /** Sign-in page and the header link. The form is design-only until the user system exists. */
  showLogin: true,
  /** DEMO: fixed preview accounts (2222 client, 1111 CEO) that open the sample panels. Browser-only, protects nothing. Set to false and delete src/lib/panel/demo.ts when real auth exists. */
  demoPanel: true,
};
