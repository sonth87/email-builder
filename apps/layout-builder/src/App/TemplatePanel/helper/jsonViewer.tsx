import { githubLight } from "@uiw/codemirror-theme-github";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import React, { memo } from "react";

type JsonViewerProps = {
  value: string;
};

const JsonViewer = memo(({ value }: JsonViewerProps) => {
  return (
    <ReactCodeMirror
      value={value}
      height="100%"
      theme={githubLight}
      extensions={[json()]}
      readOnly
      // onChange={onChange}
    />
  );
});

export default JsonViewer;
