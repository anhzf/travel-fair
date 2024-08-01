import { defineConfig, presetUno, presetWebFonts, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        Inter: ['400', '500', '600', '700'],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
});