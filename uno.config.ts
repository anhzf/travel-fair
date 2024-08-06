import { defineConfig, presetUno, presetWebFonts, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      timeouts: false,
      fonts: {
        sans: 'Poppins:400,500,600,700,800,900',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
});