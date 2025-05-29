import hljs from "highlight.js/lib/core";
import jsonHighlighter from "highlight.js/lib/languages/json";
import xmlHighlighter from "highlight.js/lib/languages/xml";
// Import prettier without destructuring
import prettier from "prettier/standalone";
// Import all required parsers
import babelParser from "prettier/parser-babel";
import "highlight.js/styles/github.css";

import * as prettierStandalone from "prettier/standalone";
import * as prettierHtml from "prettier/parser-html";

hljs.registerLanguage("json", jsonHighlighter);
hljs.registerLanguage("html", xmlHighlighter);

export async function html(value: string): Promise<string> {
  try {
    // Make sure we're correctly accessing the format function
    if (prettierStandalone && prettierStandalone.format) {
      const result = await prettierStandalone.format(value, {
        parser: "html",
        plugins: [prettierHtml],
      });
      return hljs.highlight(result, { language: "html" }).value;
    } else {
      console.error("Prettier format function not available");
      return hljs.highlight(value, { language: "html" }).value;
    }
  } catch (error) {
    console.error("Error formatting HTML:", error);
    return hljs.highlight(value, { language: "html" }).value;
  }
}

export async function json(value: string): Promise<string> {
  try {
    const prettyValue = await prettier.format(value, {
      parser: "json",
      printWidth: 0,
      trailingComma: "all",
      plugins: [babelParser],
    });
    return hljs.highlight(prettyValue, { language: "javascript" }).value;
  } catch (error) {
    console.error("JSON formatting error:", error);
    return hljs.highlight(value, { language: "json" }).value;
  }
}
