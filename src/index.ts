import { Elosnoc, ElosnocOptions, LogLevel, Renderer } from 'elosnoc'
import { IFont, font } from 'terminal-font'

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
  ALERT: '🦊',
  CRITICAL: '☠️',
  DEBUG: '🐶',
  EMERGENCY: '👨',
  ERROR: '🐷',
  INFO: '🐰',
  NOTICE: '🐱',
  WARN: '🐯',
}

const KapyuRenderer = (options?: {
  ellipsis?: { left?: number; right?: number; ellipsisString?: string }
  nowrap?: boolean
}) => {
  const start = process.hrtime.bigint()
  return (level: LogLevel, content: unknown) => {
    const left = options?.ellipsis?.left || 0
    const right = options?.ellipsis?.right || 0
    const ellipsisString = options?.ellipsis?.ellipsisString || '  ...  '
    const nowrap = options?.nowrap || false

    const x = typeof content === 'object' ? JSON.stringify(content, null, 2) : `${content}`
    const y = nowrap ? x.replaceAll('\r\n', ' ').replaceAll('\n', ' ') : x
    const z =
      (left === 0 && right === 0) || y.length <= left + right
        ? y
        : `${y.slice(0, left)}${ellipsisString}${y.slice(y.length - right)}`

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
    const ct = styleMap[level].apply(`${z}`)
    return `${ts}${ts2} ${ej} ${lv} ${ct}`
  }
}

type RenderOptions = Parameters<typeof KapyuRenderer>[0]

const Kapyu = (options?: RenderOptions & ElosnocOptions) =>
  Elosnoc({
    renderer: KapyuRenderer(options),
    ...options,
  })

export { KapyuRenderer, Kapyu }

/** KAPYU~ */
