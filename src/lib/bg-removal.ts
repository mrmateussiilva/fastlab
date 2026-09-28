import { removeBackground, Config } from '@imgly/background-removal';

export async function removeImageBackground(imageSource: File | Blob | string): Promise<Blob> {
  // @imgly/background-removal uses unpkg.com/@imgly/background-removal by default to fetch WASM and ONNX models.
  const resultBlob = await removeBackground(imageSource, {
    publicPath: 'https://unpkg.com/@imgly/background-removal@1.7.0/dist/',
    progress: (key, current, total) => {
      console.log(`Downloading ${key}: ${current} of ${total}`);
    }
  });

  return resultBlob;
}
