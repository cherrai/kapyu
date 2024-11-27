import { Combinator, Elosnoc, ElosnocOptions, LogLevel, Renderer, gulp, syslog } from 'elosnoc'
import { IFont, font } from 'terminal-font'
import * as R from 'ramda'

const styleMap: Record<LogLevel, IFont> = {
  ALERT: font().yellow(),
  CRITICAL: font().red(),
  DEBUG: font().white(),
  EMERGENCY: font().red(),
  ERROR: font().red(),
  INFO: font().green(),
  NOTICE: font().green(),
  WARN: font().yellow(),
}

const emoji: Record<LogLevel, string> = {
  ALERT: '🐯',
  CRITICAL: '👨',
  DEBUG: '🐶',
  EMERGENCY: '☠️',
  ERROR: '🐷',
  INFO: '🐰',
  NOTICE: '🐱',
  WARN: '🦊',
}

type CombinatorWrapper<P = string, K = string, R = string, S = string> = (source: Combinator<P, K>) => Combinator<P, K>

const KapyuRenderer =
  (options?: {
    ellipsis?: { left?: number; right?: number; transformer?: string | ((str: string) => string) }
    nowrap?: boolean
  }): Renderer =>
  ({ level, content }) => {
    const left = options?.ellipsis?.left || 0
    const right = options?.ellipsis?.right || 0
    const _transformer = options?.ellipsis?.transformer
    const defaultTransformer = (str: string) => font().faint().apply(` ... ${str.length} more characters ... `)
    const transformer =
      typeof _transformer === 'string'
        ? () => _transformer
        : typeof _transformer === 'object'
        ? _transformer
        : defaultTransformer

    const nowrap = options?.nowrap || false
    const x = typeof content === 'object' ? JSON.stringify(content, null, 2) : `${content}`
    const y = nowrap ? x.replaceAll('\r\n', ' ').replaceAll('\n', ' ') : x
    const z =
      (left === 0 && right === 0) || y.length <= left + right
        ? y
        : `${styleMap[level].apply(y.slice(0, left))}${transformer(y.slice(left, y.length - right))}${styleMap[
            level
          ].apply(y.slice(y.length - right))}`

    return styleMap[level].apply(z)
  }

const KapyuCombinator = (options?: { separator?: string; syslog?: boolean }) => {
  const start = process.hrtime.bigint()
  const kapyuTS: CombinatorWrapper =
    (source) =>
    ({ level, rendered, logLevel }) => {
      const pass = ((x: string) => {
        return `${x.slice(0, x.length - 9)}.${x.slice(x.length - 9)}`
      })((process.hrtime.bigint() - start).toString().padStart(10, '0')).padStart(17, ' ')

      const ts = font()
        .set({ color: font.rgb(245, 169, 184), fontStyle: 'bold' })
        .apply(`[${pass}]`)
      const ts2 = font()
        .set({ color: font.hexColor('#47a9fa'), fontStyle: 'bold' })
        .apply(`[${new Date().toLocaleString('ja-jp')}]`)

      const ej = emoji[level]
      const lv = styleMap[level].bold().apply(`[${level}]`)
      return `${ts}${ts2} ${ej} ${lv} ${source({ level, rendered, logLevel })}`
    }
  const combinator = kapyuTS(gulp(options?.separator))
  return options?.syslog ? syslog(combinator) : combinator
}

type RenderOptions = Parameters<typeof KapyuRenderer>[0]
type CombinatorOptions = Parameters<typeof KapyuCombinator>[0]

const Kapyu = (options?: RenderOptions & ElosnocOptions & CombinatorOptions) =>
  Elosnoc({
    renderer: KapyuRenderer(options),
    combinator: KapyuCombinator(options),
    ...options,
  })

export { KapyuRenderer, Kapyu }

/** KAPYU~ */
