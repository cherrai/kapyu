import { Kapyu } from '../dist'

const kapyu = Kapyu({ ellipsis: { left: 50, right: 50 }, nowrap: true })
const kapyu2 = Kapyu({ ellipsis: { left: 50, right: 50 }, syslog: true })
const kapyu3 = Kapyu()

const f = Math.floor
const r = Math.random
const k = Object.keys(kapyu)
const fc = String.fromCharCode
const rg = (x: number) => (y: number) => f(r() * (y - x)) + x

kapyu3.critical({ x: 4, y: '333', z: { w: () => {} } }, { z: 89, k: 66 })

const ex = (l) =>
  l[k[rg(0)(8)]](
    ...Array(rg(1)(16))
      .fill('19260817')
      .map(() =>
        Array(rg(1)(1024))
          .fill('19260817')
          .map(() => fc(rg(32)(127)))
          .join('')
      )
  )

setInterval(() => {
  ex(kapyu), ex(kapyu2)
}, 1024)
