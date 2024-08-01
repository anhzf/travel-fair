import { defineConfig, presetUno, presetWebFonts, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      timeouts: {
        failure: undefined,
      },
      fonts: {
        Inter: ['400', '500', '600', '700'],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
});