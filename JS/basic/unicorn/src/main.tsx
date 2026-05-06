import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import './styles.css'

type Preset = {
  name: string
  type: 'plane' | 'sphere' | 'waterPlane'
  colors: [string, string, string]
  uFrequency: number
  uStrength: number
  uSpeed: number
  cDistance: number
  cPolarAngle: number
  lightType: '3d' | 'env'
}

const presets: Preset[] = [
  {
    name: 'Aurora',
    type: 'plane',
    colors: ['#52ff89', '#dbba95', '#d0bce1'],
    uFrequency: 5.5,
    uStrength: 4,
    uSpeed: 0.4,
    cDistance: 3.6,
    cPolarAngle: 90,
    lightType: '3d',
  },
  {
    name: 'Orb',
    type: 'sphere',
    colors: ['#f6ff7a', '#26d0ce', '#ff4ecd'],
    uFrequency: 3.2,
    uStrength: 1.8,
    uSpeed: 0.55,
    cDistance: 5.2,
    cPolarAngle: 115,
    lightType: '3d',
  },
  {
    name: 'Tide',
    type: 'waterPlane',
    colors: ['#75f4f4', '#6d5dfc', '#f3b562'],
    uFrequency: 7,
    uStrength: 3.4,
    uSpeed: 0.28,
    cDistance: 4.4,
    cPolarAngle: 78,
    lightType: 'env',
  },
]

function App() {
  const [activePreset, setActivePreset] = useState(0)
  const [animated, setAnimated] = useState(true)
  const [grain, setGrain] = useState(true)

  const preset = presets[activePreset]
  const swatches = useMemo(
    () =>
      preset.colors.map((color) => ({
        backgroundColor: color,
      })),
    [preset.colors],
  )

  return (
    <main className="stage">
      <ShaderGradientCanvas
        style={{ position: 'absolute', inset: 0 }}
        pixelDensity={1.5}
        fov={45}
      >
        <ShaderGradient
          type={preset.type}
          animate={animated ? 'on' : 'off'}
          color1={preset.colors[0]}
          color2={preset.colors[1]}
          color3={preset.colors[2]}
          uFrequency={preset.uFrequency}
          uStrength={preset.uStrength}
          uSpeed={preset.uSpeed}
          cDistance={preset.cDistance}
          cPolarAngle={preset.cPolarAngle}
          lightType={preset.lightType}
          grain={grain ? 'on' : 'off'}
          reflection={0.38}
          brightness={1.05}
        />
      </ShaderGradientCanvas>

      <section className="panel" aria-label="ShaderGradient controls">
        <p className="eyebrow">Vite + React demo</p>
        <h1>ShaderGradient</h1>
        <p className="summary">
          当前示例直接使用 @shadergradient/react。切换预设、动画和颗粒感，就能快速观察它的核心渲染效果。
        </p>

        <div className="controls" role="group" aria-label="Gradient presets">
          {presets.map((item, index) => (
            <button
              className={activePreset === index ? 'is-active' : ''}
              key={item.name}
              onClick={() => setActivePreset(index)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="toggles">
          <label>
            <input
              checked={animated}
              onChange={(event) => setAnimated(event.target.checked)}
              type="checkbox"
            />
            动画
          </label>
          <label>
            <input
              checked={grain}
              onChange={(event) => setGrain(event.target.checked)}
              type="checkbox"
            />
            颗粒
          </label>
        </div>

        <div className="meta">
          <span>{preset.type}</span>
          <div className="swatches" aria-label="Active colors">
            {swatches.map((style, index) => (
              <i key={`${preset.name}-${index}`} style={style} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
