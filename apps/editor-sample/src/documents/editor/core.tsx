import React from "react";
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

import ColumnsContainerEditor from "../blocks/ColumnsContainer/ColumnsContainerEditor";
import ColumnsContainerPropsSchema from "../blocks/ColumnsContainer/ColumnsContainerPropsSchema";
import ContainerEditor from "../blocks/Container/ContainerEditor";
import ContainerPropsSchema from "../blocks/Container/ContainerPropsSchema";
import EmailLayoutEditor from "../blocks/EmailLayout/EmailLayoutEditor";
import EmailLayoutPropsSchema from "../blocks/EmailLayout/EmailLayoutPropsSchema";
import EditorBlockWrapper from "../blocks/helpers/block-wrappers/EditorBlockWrapper";

const EDITOR_DICTIONARY = buildBlockConfigurationDictionary({
  Avatar: {
    schema: AvatarPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Avatar {...props} />
      </EditorBlockWrapper>
    ),
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Button {...props} />
      </EditorBlockWrapper>
    ),
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ColumnsContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Heading {...props} />
      </EditorBlockWrapper>
    ),
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Html {...props} />
      </EditorBlockWrapper>
    ),
  },
  Image: {
    schema: ImagePropsSchema,
    Component: (data) => {
      const props = {
        ...data,
        props: {
          ...data.props,
          url:
            data.props?.url ??
            "https://placehold.co/600x400@2x/F8F8F8/CCC?text=Your%20image",
        },
      };
      return (
        <EditorBlockWrapper>
          <Image {...props} />
        </EditorBlockWrapper>
      );
    },
  },
  Text: {
    schema: TextPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Text {...props} />
      </EditorBlockWrapper>
    ),
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: (p) => <EmailLayoutEditor {...p} />,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Spacer {...props} />
      </EditorBlockWrapper>
    ),
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Divider {...props} />
      </EditorBlockWrapper>
    ),
  },
});

export const EditorBlock = buildBlockComponent(EDITOR_DICTIONARY);
export const EditorBlockSchema =
  buildBlockConfigurationSchema(EDITOR_DICTIONARY);
export const EditorConfigurationSchema = z.record(
  z.string(),
  EditorBlockSchema,
);

export type TEditorBlock = z.infer<typeof EditorBlockSchema>;
export type TEditorConfiguration = Record<string, TEditorBlock>;
