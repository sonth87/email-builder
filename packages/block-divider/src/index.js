"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DividerPropsDefaults = exports.DividerPropsSchema = void 0;
exports.Divider = Divider;
const jsx_runtime_1 = require("react/jsx-runtime");
const zod_1 = require("zod");
const COLOR_SCHEMA = zod_1.z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .nullable()
    .optional();
const PADDING_SCHEMA = zod_1.z
    .object({
    top: zod_1.z.number(),
    bottom: zod_1.z.number(),
    right: zod_1.z.number(),
    left: zod_1.z.number(),
})
    .optional()
    .nullable();
const getPadding = (padding) => padding
    ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
    : undefined;
exports.DividerPropsSchema = zod_1.z.object({
    style: zod_1.z
        .object({
        backgroundColor: COLOR_SCHEMA,
        padding: PADDING_SCHEMA,
    })
        .optional()
        .nullable(),
    props: zod_1.z
        .object({
        lineColor: COLOR_SCHEMA,
        lineHeight: zod_1.z.number().optional().nullable(),
    })
        .optional()
        .nullable(),
});
exports.DividerPropsDefaults = {
    lineHeight: 1,
    lineColor: "#333333",
};
function Divider({ style, props }) {
    const st = {
        padding: getPadding(style?.padding),
        backgroundColor: style?.backgroundColor ?? undefined,
    };
    const borderTopWidth = props?.lineHeight ?? exports.DividerPropsDefaults.lineHeight;
    const borderTopColor = props?.lineColor ?? exports.DividerPropsDefaults.lineColor;
    return ((0, jsx_runtime_1.jsx)("div", { style: st, children: (0, jsx_runtime_1.jsx)("hr", { style: {
                width: "100%",
                border: "none",
                borderTop: `${borderTopWidth}px solid ${borderTopColor}`,
                margin: 0,
            } }) }));
}
