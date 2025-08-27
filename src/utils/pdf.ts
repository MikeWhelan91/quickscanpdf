import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

/** Build a multi-page A4 PDF; mild grayscale/contrast for a "scan" look. */
export async function imagesToPdf(imageUris: string[]): Promise<string> {
  const pagesHtml = await Promise.all(
    imageUris.map(async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `
      <div class="page">
        <img src="data:image/jpeg;base64,${base64}" />
      </div>`;
    })
  );

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="initial-scale=1, width=device-width"/>
      <style>
        @page { size: A4; margin: 18pt; }
        html, body { margin:0; padding:0; }
        .page { page-break-after: always; display:flex; align-items:center; justify-content:center; }
        img {
          width: 100%;
          height: auto;
          -webkit-filter: grayscale(100%) contrast(1.15) brightness(1.05);
                  filter: grayscale(100%) contrast(1.15) brightness(1.05);
        }
      </style>
    </head>
    <body>
      ${pagesHtml.join('\n')}
    </body>
  </html>`;

  const { uri } = await Print.printToFileAsync({ html });
  const dest = FileSystem.documentDirectory + `quickscanpdf_${Date.now()}.pdf`;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}
