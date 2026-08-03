import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

// Custom Markdoc tags usable INSIDE an article body.
// This is what lets Alexandra place blocks anywhere in the text, not just at
// the end. In Keystatic these appear as insertable "content components"
// (see the `components` on the `content` field in keystatic.config.ts); on the
// live site each tag renders the matching Astro component.
export default defineMarkdocConfig({
  tags: {
    // {% ghid pdf="/ghiduri/…" title="…" text="…" /%}
    // The reusable free-PDF download box (lead magnet). Drop it wherever it
    // reads best in the article.
    ghid: {
      render: component('./src/components/GuideDownload.astro'),
      attributes: {
        pdf: { type: String, required: true },
        title: { type: String },
        text: { type: String },
      },
    },
  },
});
