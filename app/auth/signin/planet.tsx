import { makeStyles, mergeClasses } from "@fluentui/react-components";

export function Planet() {
  const classes = useClasses();
  return (
    <svg
      className={mergeClasses(classes.planet, classes.rotate)}
      width="150"
      height="150"
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient
          id="earthGradient"
          gradientUnits="userSpaceOnUse"
          r="40%"
        >
          <animate
            attributeName="cx"
            dur="8s"
            repeatCount="indefinite"
            calcMode="spline"
            values="400;500;550;500;460;380;400"
            keyTimes="0;0.15;0.3;0.45;0.6;0.75;1"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate
            attributeName="cy"
            dur="8s"
            repeatCount="indefinite"
            calcMode="spline"
            values="300;300;250;280;430;350;300"
            keyTimes="0;0.15;0.3;0.45;0.6;0.75;1"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate
            attributeName="r"
            dur="8s"
            repeatCount="indefinite"
            values="35%;40%;38%;42%;35%"
            keyTimes="0;0.25;0.5;0.75;1"
          />
          <stop stopColor="#A4D4FF" offset="10%" />
          <stop stopColor="#4CA5FF" offset="45%" />
          <stop stopColor="#1A73E8" offset="100%" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <animateMotion
          id="moveAround"
          dur="4s"
          repeatCount="indefinite"
          path="M 0,0 L 100,0 L 100,100 L 0,100 Z"
        />
      </defs>
      <g stroke="none" fill="none">
        <circle fill="url(#earthGradient)" cx="400" cy="400" r="300" />

        {/* 装饰线条 */}
        <g>
          <path
            d="M400,100 Q550,250 400,400 T400,700"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            opacity="0.2"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                      M400,100 Q550,250 400,400 T400,700;
                      M400,100 Q600,300 400,400 T400,700;
                      M400,100 Q500,350 400,400 T400,700;
                      M400,100 Q550,250 400,400 T400,700
                    "
            />
          </path>
          <path
            d="M100,400 Q250,550 400,400 T700,400"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            opacity="0.2"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                      M100,400 Q250,550 400,400 T700,400;
                      M100,400 Q300,600 400,400 T700,400;
                      M100,400 Q350,500 400,400 T700,400;
                      M100,400 Q250,550 400,400 T700,400
                    "
            />
          </path>
        </g>
        <path
          d="M200,200 Q400,150 600,200"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M200,600 Q400,650 600,600"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M250,250 C350,200 450,200 550,250"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.2"
          fill="none"
        >
          <animate
            attributeName="opacity"
            values="0.1;0.3;0.1"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M250,550 C350,600 450,600 550,550"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.2"
          fill="none"
        >
          <animate
            attributeName="opacity"
            values="0.1;0.3;0.1"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* 装饰光点 */}
        <g>
          <circle cx="250" cy="300" r="3" fill="#FFFFFF" opacity="0.2">
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="550" cy="450" r="2" fill="#FFFFFF" opacity="0.15">
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="350" cy="550" r="2.5" fill="#FFFFFF" opacity="0.2">
            <animate
              attributeName="opacity"
              values="0.1;0.35;0.1"
              dur="5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="450" cy="200" r="2" fill="#FFFFFF" opacity="0.15">
            <animate
              attributeName="opacity"
              values="0.1;0.25;0.1"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="600" cy="350" r="1.5" fill="#FFFFFF" opacity="0.2">
            <animate
              attributeName="opacity"
              values="0.1;0.3;0.1"
              dur="4.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="200" cy="450" r="2" fill="#FFFFFF" opacity="0.15">
            <animate
              attributeName="opacity"
              values="0.1;0.25;0.1"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        <circle
          stroke="#FFFFFF"
          strokeWidth="3"
          cx="400"
          cy="400"
          r="300"
          opacity="0.15"
        />

        {/* 眼球效果 */}
        <g>
          {/* 外部光晕 */}
          <circle fill="#FFFFFF" r="112" opacity="0.08" filter="url(#eyeGlow)">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyPoints="0;0.15;0.3;0.45;0.6;0.75;0.9;1"
              keyTimes="0;0.15;0.3;0.45;0.6;0.75;0.9;1"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            >
              <mpath href="#eyePath" />
            </animateMotion>
          </circle>

          {/* 中间光晕 */}
          <circle fill="#FFFFFF" r="80" opacity="0.15" filter="url(#eyeGlow)">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyPoints="0;0.15;0.3;0.45;0.6;0.75;0.9;1"
              keyTimes="0;0.15;0.3;0.45;0.6;0.75;0.9;1"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            >
              <mpath href="#eyePath" />
            </animateMotion>
          </circle>

          {/* 眼球主体 */}
          <circle fill="#FFFFFF" r="58" opacity="1" filter="url(#eyeGlow)">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              calcMode="spline"
              keyPoints="0;0.15;0.3;0.45;0.6;0.75;0.9;1"
              keyTimes="0;0.15;0.3;0.45;0.6;0.75;0.9;1"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
            >
              <mpath href="#eyePath" />
            </animateMotion>
          </circle>
        </g>

        {/* 定义发光滤镜 */}
        <defs>
          <filter id="eyeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="15" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 定义眼球运动路径 */}
        <path
          id="eyePath"
          d="M 400,300 C 500,300 550,250 500,280
                   C 450,310 520,400 460,430
                   C 400,460 340,400 380,350
                   C 420,300 350,250 400,300"
          stroke="none"
          fill="none"
        />

        {/* 其他装饰点 */}
        <circle
          fill="#FFFFFF"
          cx="250"
          cy="300"
          r="4"
          opacity="0.2"
          filter="url(#glow)"
        />
        <circle
          fill="#FFFFFF"
          cx="500"
          cy="450"
          r="3"
          opacity="0.15"
          filter="url(#glow)"
        />
        <circle
          fill="#FFFFFF"
          cx="350"
          cy="550"
          r="5"
          opacity="0.2"
          filter="url(#glow)"
        />

        {/* 装饰光点轨迹 */}
        <g>
          <path
            id="particlePath1"
            d="M 250,250 Q 400,300 550,250"
            stroke="none"
            fill="none"
          />
          <circle r="1.5" fill="#FFFFFF" opacity="0.3">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M 250,250 Q 400,300 550,250"
            >
              <mpath href="#particlePath1" />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;0.3;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>

          <path
            id="particlePath2"
            d="M 250,550 Q 400,500 550,550"
            stroke="none"
            fill="none"
          />
          <circle r="1.5" fill="#FFFFFF" opacity="0.3">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M 250,550 Q 400,500 550,550"
            >
              <mpath href="#particlePath2" />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;0.3;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
}

const useClasses = makeStyles({
  planet: {},
  rotate: {
    animationName: {
      from: {
        transform: "rotate(0deg)",
      },
      to: {
        transform: "rotate(360deg)",
      },
    },
    animationDuration: "20s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  }
});
