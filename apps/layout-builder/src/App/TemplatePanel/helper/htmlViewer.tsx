import React, { memo, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { githubLight } from "@uiw/codemirror-theme-github";

// Use a different approach to import prettier for browser environments
import * as prettierStandalone from "prettier/standalone";
import * as prettierHtml from "prettier/parser-html";

type HtmlViewerProps = {
  value: string;
};

const HtmlViewer = memo(({ value }: HtmlViewerProps) => {
  const [formattedValue, setFormattedValue] = useState(value);
  
  useEffect(() => {
    const formatCode = async () => {
      try {
        // Make sure we're correctly accessing the format function
        if (prettierStandalone && prettierStandalone.format) {
          const result = await prettierStandalone.format(value, {
            parser: "html",
            plugins: [prettierHtml]
          });
          setFormattedValue(result);
        } else {
          console.error("Prettier format function not available");
          setFormattedValue(value);
        }
      } catch (error) {
        console.error("Error formatting HTML:", error);
        setFormattedValue(value);
      }
    };
    
    formatCode();
  }, [value]);

  return (
    <CodeMirror
      value={formattedValue}
      height="100%"
      theme={githubLight}
      extensions={[html()]}
      readOnly
      // onChange={onChange}
    />
  );
});

export default HtmlViewer;
