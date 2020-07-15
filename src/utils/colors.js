import lighten from 'polished/lib/color/lighten';
import darken from 'polished/lib/color/darken';
// import shade from 'polished/lib/color/shade';

export const orange = '#ff6f55';
export const darkOrange = darken(0.2, orange);
export const lightOrange = lighten(0.2, orange);

export const gray = '#bdc3c7';
export const lightGray = lighten(0.2, gray);
export const darkGray = darken(0.2, gray);

export const white = '#ffffff';
export const offWhite = '#F5F7FA';
export const darkOffWhite = darken(0.05, offWhite);

export const lightBlack = '#565656';
export const black = '#1F1F1F';
// 424242

export const red = '#D8000C';
export const lightRed = '#FFBABA';

export const blue = "#387eec";
export const darkBlue = darken(0.05, blue);
export const lightBlue = lighten(0.40, blue);

export const green = "#9BD187";
export const darkGreen = darken(0.15, green);
export const lightGreen = "#E6FFE0";

export const purple = "#A367FF";

export const yellow = "#F3D55B";
export const lightYellow = lighten(0.25, yellow);

export const secondaryMenu = lighten(0.15, gray);