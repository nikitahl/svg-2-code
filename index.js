import CodeMirror from './codemirror/lib/codemirror.js'
import './codemirror/mode/xml/xml.js'

(function() {
  const input = document.querySelector('input[type=file]')
  const result = document.getElementById('result')
  const preview = document.querySelector('.preview')
  const download = document.getElementById('download')
  const copy = document.getElementById('copy')
  const previewBg = document.getElementById('preview-bg')
  let code = ''

  const editor = CodeMirror.fromTextArea(result, {
    lineNumbers: true,
    mode: {
      name: 'xml'
    },
    theme: 'default',
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

  function readFile(event) {
    const value = (event.target && event.target.result) || event
    if (event.target && event.target.result) {
      editor.setValue(value)
    }
    const fragment = document.createRange().createContextualFragment(value)
    if (fragment.querySelector('svg')) {
      preview.innerHTML = value
      code = value
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

  input.addEventListener('change', changeFile)
  copy.addEventListener('click', handleCopy)
  download.addEventListener('click', handleDownload)
  previewBg.addEventListener('input', handlePreviewBgChange)

  handlePreviewBgChange()
})()