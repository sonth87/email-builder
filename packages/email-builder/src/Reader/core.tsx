import React, { JSX, createContext, useContext } from "react";
import { z } from "zod";

import { Avatar, AvatarPropsSchema } from "@core-builder/block-avatar";
import { Button, ButtonPropsSchema } from "@core-builder/block-button";
import { Divider, DividerPropsSchema } from "@core-builder/block-divider";
import { Heading, HeadingPropsSchema } from "@core-builder/block-heading";
import { Html, HtmlPropsSchema } from "@core-builder/block-html";
import { Image, ImagePropsSchema } from "@core-builder/block-image";
import { Spacer, SpacerPropsSchema } from "@core-builder/block-spacer";
import { Text, TextPropsSchema } from "@core-builder/block-text";
import {
  buildBlockComponent,
  buildBlockConfigurationDictionary,
  buildBlockConfigurationSchema,
} from "@core-builder/document-core";

import ColumnsContainerPropsSchema from "../blocks/ColumnsContainer/ColumnsContainerPropsSchema";
import ColumnsContainerReader from "../blocks/ColumnsContainer/ColumnsContainerReader";
import { ContainerPropsSchema } from "../blocks/Container/ContainerPropsSchema";
import ContainerReader from "../blocks/Container/ContainerReader";
import { EmailLayoutPropsSchema } from "../blocks/EmailLayout/EmailLayoutPropsSchema";
import EmailLayoutReader from "../blocks/EmailLayout/EmailLayoutReader";

const ReaderContext = createContext<TReaderDocument>({});

function useReaderDocument() {
  return useContext(ReaderContext);
}

const READER_DICTIONARY = buildBlockConfigurationDictionary({
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: ColumnsContainerReader,
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: ContainerReader,
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: EmailLayoutReader,
  },
  //
  Avatar: {
    schema: AvatarPropsSchema,
    Component: Avatar,
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: Button,
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: Divider,
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: Heading,
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: Html,
  },
  Image: {
    schema: ImagePropsSchema,
    Component: Image,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: Spacer,
  },
  Text: {
    schema: TextPropsSchema,
    Component: Text,
  },
});

export const ReaderBlockSchema =
  buildBlockConfigurationSchema(READER_DICTIONARY);
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
export type TReaderDocument = Record<string, TReaderBlock>;

const BaseReaderBlock = buildBlockComponent(
  READER_DICTIONARY
) as JSX.ElementType;

export type TReaderBlockProps = { id: string };
export function ReaderBlock({ id }: TReaderBlockProps) {
  const document = useReaderDocument();
  return <BaseReaderBlock {...document[id]} />;
}

export type TReaderProps = {
  document: Record<string, z.infer<typeof ReaderBlockSchema>>;
  rootBlockId: string;
};
export default function Reader({ document, rootBlockId }: TReaderProps) {
  return (
    <ReaderContext.Provider value={document}>
      <ReaderBlock id={rootBlockId} />
    </ReaderContext.Provider>
  );
}
