const PDFDocument = require('pdfkit')

const HEADING = /^[A-ZÉÈÀÂÊÎÔÛÇ' ]{6,}$/

// Builds the project recap PDF from the already-validated request (same text as the stored summary).
function buildProjectPdf({ name, email, message }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 56, info: { Title: `Recap projet - ${name}`, Author: 'Portfolio' } })
    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.font('Helvetica-Bold').fontSize(20).text('Récapitulatif de projet')
    doc.moveDown(0.3).font('Helvetica').fontSize(10).fillColor('#555')
      .text(`${name} <${email}>  ·  ${new Date().toLocaleDateString('fr-FR')}`)
    doc.moveDown(1).fillColor('#000')

    for (const raw of String(message).split('\n')) {
      const line = raw.trimEnd()
      if (!line) { doc.moveDown(0.5); continue }
      if (HEADING.test(line)) {
        doc.moveDown(0.4).font('Helvetica-Bold').fontSize(12).fillColor('#111').text(line)
        doc.moveTo(doc.x, doc.y + 1).lineTo(doc.page.width - doc.page.margins.right, doc.y + 1).strokeColor('#999').stroke()
        doc.moveDown(0.4)
      } else {
        doc.font('Helvetica').fontSize(10.5).fillColor('#000').text(line, { lineGap: 2 })
      }
    }

    doc.end()
  })
}

module.exports = { buildProjectPdf }
