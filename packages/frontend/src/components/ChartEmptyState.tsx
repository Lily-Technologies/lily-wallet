export const ChartEmptyState = () => {
  return (
    <svg
      width='100%'
      height='245'
      style={{ position: 'absolute', bottom: 0 }}
      viewBox='0 0 800 245'
      fill='none'
      preserveAspectRatio='none'
    >
      <path
        opacity='0.5'
        d='M274.598 135.58C166.063 135.58 167.611 75.897 0 75.897V245h799V98.132S751.141 1 599.5 1 383.133 135.58 274.598 135.58z'
        fill='url(#empty-chart_svg__paint0_linear)'
      ></path>
      <path
        d='M0 75.897c167.611 0 166.063 59.683 274.598 59.683C383.133 135.58 447.859 1 599.5 1S799 98.132 799 98.132'
        stroke='#F1F3F5'
        strokeWidth='2'
      ></path>
      <defs>
        <linearGradient
          id='empty-chart_svg__paint0_linear'
          x1='392.991'
          y1='1'
          x2='392.991'
          y2='245'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#F1F3F5'></stop>
          <stop offset='1' stopColor='#F1F3F5' stopOpacity='0'></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
