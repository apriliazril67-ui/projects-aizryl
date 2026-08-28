import '../styles/robot.css';

/**
 * The AzryAI mascot — a small hologram-glass robot.
 * state: "idle" | "thinking" | "responding"
 */
export default function RobotMascot({ state = 'idle', size = 180, showStatus = true }) {
  const statusLabel = {
    idle: 'Standby',
    thinking: 'Berpikir…',
    responding: 'Menjawab'
  }[state];

  return (
    <div className="robot-wrap" style={{ width: size, height: size }}>
      <div className="robot-aura" />
      <svg
        className={`robot-svg ${state}`}
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Robot AzryAI — status ${statusLabel}`}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1c1a3f" />
            <stop offset="100%" stopColor="#0b0a1f" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#39f6ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <radialGradient id="eyeGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#bafcff" />
            <stop offset="100%" stopColor="#39f6ff" />
          </radialGradient>
        </defs>

        {/* respond ring */}
        <circle className="respond-ring" cx="100" cy="100" r="70" stroke="url(#rimGrad)" strokeWidth="2" />

        {/* antenna */}
        <line x1="100" y1="26" x2="100" y2="10" stroke="url(#rimGrad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="8" r="5" fill="#39f6ff" />

        {/* head */}
        <rect x="52" y="28" width="96" height="80" rx="26" fill="url(#bodyGrad)" stroke="url(#rimGrad)" strokeWidth="2.5" />

        {/* visor */}
        <rect x="66" y="52" width="68" height="34" rx="17" fill="#050414" stroke="rgba(57,246,255,0.35)" strokeWidth="1.5" />

        {/* eyes */}
        <ellipse className="robot-eye left" cx="86" cy="69" rx="7" ry="9" fill="url(#eyeGlow)" />
        <ellipse className="robot-eye right" cx="114" cy="69" rx="7" ry="9" fill="url(#eyeGlow)" />

        {/* mouth: idle line, animates as bars when responding */}
        <g transform="translate(85,94)">
          <rect className="mouth-bar" x="0" y="0" width="6" height="6" rx="3" fill="#39f6ff" />
          <rect className="mouth-bar" x="12" y="-2" width="6" height="10" rx="3" fill="#8b5cf6" />
          <rect className="mouth-bar" x="24" y="0" width="6" height="6" rx="3" fill="#39f6ff" />
        </g>

        {/* thinking orbit dots */}
        <g className="think-orbit">
          <circle cx="140" cy="70" r="3.5" fill="#ff5fd1" />
          <circle cx="60" cy="70" r="2.5" fill="#39f6ff" opacity="0.7" />
        </g>

        {/* neck + body */}
        <rect x="78" y="108" width="44" height="14" rx="6" fill="url(#bodyGrad)" stroke="rgba(57,246,255,0.25)" strokeWidth="1.5" />
        <rect x="58" y="122" width="84" height="58" rx="22" fill="url(#bodyGrad)" stroke="url(#rimGrad)" strokeWidth="2.5" />

        {/* chest core */}
        <circle cx="100" cy="150" r="14" fill="#050414" stroke="url(#rimGrad)" strokeWidth="2" />
        <circle cx="100" cy="150" r="6" fill="#39f6ff" opacity="0.9" />

        {/* shoulder lights */}
        <circle cx="62" cy="132" r="4" fill="#8b5cf6" />
        <circle cx="138" cy="132" r="4" fill="#39f6ff" />
      </svg>
      {showStatus && <span className="robot-status-chip">{statusLabel}</span>}
    </div>
  );
}
