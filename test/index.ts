import { Kapyu } from '../src'

const kapyu = Kapyu({ ellipsis: { left: 50, right: 50 }, nowrap: true })

const f = Math.floor
const r = Math.random
const k = Object.keys(kapyu)
const fc = String.fromCharCode
const rg = (x: number) => (y: number) => f(r() * (y - x)) + x

kapyu.critical({ x: 4, y: { z: 2, w: () => {} } })
kapyu.critical('x\n8\r\n9')

/**@ts-ignore */
setInterval(
  () =>
    kapyu[k[rg(0)(8)]](
      Array(rg(1)(1000))
        .fill(0)
        .map((_) => fc(rg(32)(127)))
        .join('')
    ),
  1000
)
