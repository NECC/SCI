export const ArrowRight = ({ className, ...props }) => {
  return (
    <svg
      className={className}
      width="45"
      height="75"
      viewBox="0 0 45 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="9.85864"
        y="8"
        width="42.6423"
        height="2.62863"
        transform="rotate(45 9.85864 8)"
        fill="white"
      />
      <rect
        x="8"
        y="66.1526"
        width="42.6423"
        height="2.62863"
        transform="rotate(-45 8 66.1526)"
        fill="white"
      />
      <circle
        cx="36.9409"
        cy="37.9408"
        r="5.615"
        transform="rotate(45 36.9409 37.9408)"
        fill="#FBBF24"
      />
      <circle
        cx="7.94092"
        cy="66.9408"
        r="5.615"
        transform="rotate(45 7.94092 66.9408)"
        fill="#FBBF24"
      />
      <circle
        cx="7.94092"
        cy="7.9408"
        r="5.615"
        transform="rotate(45 7.94092 7.9408)"
        fill="#FBBF24"
      />
    </svg>
  );
};
