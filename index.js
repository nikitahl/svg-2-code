import CodeMirror from './codemirror/lib/codemirror.js'
import './codemirror/mode/xml/xml.js'

(function() {
  const input = document.querySelector('input[type=file]')
  const result = document.getElementById('result')
  const preview = document.querySelector('.preview')
  const download = document.getElementById('download')
  const copy = document.getElementById('copy')
  const previewBg = document.getElementById('preview-bg')
  const react = document.getElementById('react-checkbox')
  let code = ''
  let theme = 'default'

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'material-darker'
  }

  const editor = CodeMirror.fromTextArea(result, {
    lineNumbers: true,
    mode: {
      name: 'xml'
    },
    theme: theme,
    tabSize: 2
  })

  editor.on('change', function(editor) {
    const value = editor.getValue()
    readFile(value)
  })

  function svgDataURL(svg) {
    const svgAsXML = (new XMLSerializer).serializeToString(svg)
    return 'data:image/svg+xml,' + encodeURIComponent(svgAsXML)
  }

  const ATTRIBUTE_MAPPING = {
    'class': 'className',
    'accent-height': 'accentHeight',
    'alignment-baseline': 'alignmentBaseline',
    'arabic-form': 'arabicForm',
    'baseline-shift': 'baselineShift',
    'cap-height': 'capHeight',
    'clip-path': 'clipPath',
    'clip-rule': 'clipRule',
    'color-interpolation': 'colorInterpolation',
    'color-interpolation-filters': 'colorInterpolationFilters',
    'color-profile': 'colorProfile',
    'color-rendering': 'colorRendering',
    'dominant-baseline': 'dominantBaseline',
    'enable-background': 'enableBackground',
    'fill-opacity': 'fillOpacity',
    'fill-rule': 'fillRule',
    'flood-color': 'floodColor',
    'flood-opacity': 'floodOpacity',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-size-adjust': 'fontSizeAdjust',
    'font-stretch': 'fontStretch',
    'font-style': 'fontStyle',
    'font-variant': 'fontVariant',
    'font-weight': 'fontWeight',
    'glyph-name': 'glyphName',
    'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
    'glyph-orientation-vertical': 'glyphOrientationVertical',
    'horiz-adv-x': 'horizAdvX',
    'horiz-origin-x': 'horizOriginX',
    'image-rendering': 'imageRendering',
    'letter-spacing': 'letterSpacing',
    'lighting-color': 'lightingColor',
    'marker-end': 'markerEnd',
    'marker-mid': 'markerMid',
    'marker-start': 'markerStart',
    'overline-position': 'overlinePosition',
    'overline-thickness': 'overlineThickness',
    'paint-order': 'paintOrder',
    'panose-1': 'panose1',
    'pointer-events': 'pointerEvents',
    'rendering-intent': 'renderingIntent',
    'shape-rendering': 'shapeRendering',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'strikethrough-position': 'strikethroughPosition',
    'strikethrough-thickness': 'strikethroughThickness',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-miterlimit': 'strokeMiterlimit',
    'stroke-opacity': 'strokeOpacity',
    'stroke-width': 'strokeWidth',
    'text-anchor': 'textAnchor',
    'text-decoration': 'textDecoration',
    'text-rendering': 'textRendering',
    'underline-position': 'underlinePosition',
    'underline-thickness': 'underlineThickness',
    'unicode-bidi': 'unicodeBidi',
    'unicode-range': 'unicodeRange',
    'units-per-em': 'unitsPerEm',
    'v-alphabetic': 'vAlphabetic',
    'v-hanging': 'vHanging',
    'v-ideographic': 'vIdeographic',
    'v-mathematical': 'vMathematical',
    'vector-effect': 'vectorEffect',
    'vert-adv-y': 'vertAdvY',
    'vert-origin-x': 'vertOriginX',
    'vert-origin-y': 'vertOriginY',
    'word-spacing': 'wordSpacing',
    'writing-mode': 'writingMode',
    'x-height': 'xHeight',
    'xlink:actuate': 'xlinkActuate',
    'xlink:arcrole': 'xlinkArcrole',
    'xlink:href': 'xlinkHref',
    'xlink:role': 'xlinkRole',
    'xlink:show': 'xlinkShow',
    'xlink:title': 'xlinkTitle',
    'xlink:type': 'xlinkType',
    'xml:base': 'xmlBase',
    'xml:lang': 'xmlLang',
    'xml:space': 'xmlSpace',
    'xmlns:xlink': 'xmlnsXlink'
  }

  function htmlToJsx(htmlStr) {
    let result = htmlStr
    for (const [ htmlAttr, jsxAttr ] of Object.entries(ATTRIBUTE_MAPPING)) {
      const escapedHtmlAttr = htmlAttr.replace(/:/g, '\\:')
      const regex = new RegExp(`\\b${escapedHtmlAttr}\\s*=`, 'g')
      result = result.replace(regex, `${jsxAttr}=`)
    }
    return result
  }

  function jsxToHtml(jsxStr) {
    let result = jsxStr
    for (const [ htmlAttr, jsxAttr ] of Object.entries(ATTRIBUTE_MAPPING)) {
      const regex = new RegExp(`\\b${jsxAttr}\\s*=`, 'g')
      result = result.replace(regex, `${htmlAttr}=`)
    }
    return result
  }

  function readFile(event) {
    const value = (event.target && event.target.result) || event
    if (event.target && event.target.result) {
      const editorValue = react.checked ? htmlToJsx(value) : value
      editor.setValue(editorValue)
    }
    const standardSvg = react.checked ? jsxToHtml(value) : value
    const fragment = document.createRange().createContextualFragment(standardSvg)
    if (fragment.querySelector('svg')) {
      preview.innerHTML = standardSvg
      code = react.checked ? htmlToJsx(standardSvg) : standardSvg
      copy.removeAttribute('disabled')
      const svg = preview.querySelector('svg')
      download.href = svgDataURL(svg)
      download.setAttribute('download', 'image.svg')
    } else {
      preview.innerHTML = 'Not a valid SVG code'
    }
    if (!value) {
      copy.setAttribute('disabled', true)
      preview.innerHTML = ''
    }
  }

  function changeFile() {
    const file = input.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', readFile)
    reader.readAsText(file)
  }

  function handleCopy (e) {
    window.navigator.clipboard.writeText(code)
    e.target.classList.add('copied')
    setTimeout(() => {
      e.target.classList.remove('copied')
    }, 1000)
  }

  function handleDownload (e) {
    if (!e.currentTarget.getAttribute('href')) {
      e.preventDefault()
    }
  }

  function handlePreviewBgChange (e) {
    preview.style.background = e?.target?.value || '#e3e3e3'
  }

  function handleReactChange() {
    const value = editor.getValue()
    if (!value) return
    if (react.checked) {
      editor.setValue(htmlToJsx(value))
    } else {
      editor.setValue(jsxToHtml(value))
    }
  }

  input.addEventListener('change', changeFile)
  copy.addEventListener('click', handleCopy)
  download.addEventListener('click', handleDownload)
  previewBg.addEventListener('input', handlePreviewBgChange)
  react.addEventListener('change', handleReactChange)

  handlePreviewBgChange()
})()