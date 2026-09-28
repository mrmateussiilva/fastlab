import { removeBackground, Config } from '@imgly/background-removal';

export async function removeImageBackground(imageSource: File | Blob | string): Promise<Blob> {
  const config: Config = {
    publicPath: 'https://static.remove-bg.io/model/', // We might need to configure the asset path, or rely on unpkg default
  };
  
  // @imgly/background-removal uses unpkg.com/@imgly/background-removal by default to fetch WASM and ONNX models.
  const resultBlob = await removeBackground(imageSource, {
    progress: (key, current, total) => {
      console.log(`Downloading ${key}: ${current} of ${total}`);
    }
  });

  return resultBlob;
}
