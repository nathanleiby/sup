import {
  Box,
  CloseButton,
  ColorSwatch,
  Group,
  MultiSelectValueProps,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";

import { forwardRef } from "react";
import { colors } from "../colors";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

export const TagSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => {
    const theme = useMantineTheme();
    const [color, variant] = tagToColor(label).split(".");
    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <ColorSwatch
            size={16}
            color={theme.colors[color][parseInt(variant)]}
          />
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </Group>
      </div>
    );
  }
);

export function Value({
  value,
  label,
  onRemove,
  classNames,
  ...others
}: MultiSelectValueProps & { value: string }) {
  //   const Flag = flags[value]; // TODO
  const theme = useMantineTheme();
  const [color, variant] = tagToColor(value).split(".");
  return (
    <div {...others}>
      <Box
        sx={(theme) => ({
          display: "flex",
          cursor: "default",
          alignItems: "center",
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
          border: `${rem(1)} solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[4]
          }`,
          paddingLeft: theme.spacing.xs,
          borderRadius: theme.radius.sm,
        })}
      >
        <Box mr={10}>
          <ColorSwatch
            size={16}
            color={theme.colors[color][parseInt(variant)]}
          />
        </Box>
        <Box sx={{ lineHeight: 1, fontSize: rem(12) }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      </Box>
    </div>
  );
}

const hashStrToNum = (s: string) => {
  var hash = 0,
    i = 0,
    len = s.length;
  while (i < len) {
    hash = ((hash << 5) - hash + s.charCodeAt(i++)) << 0;
  }
  const positive = hash + 2147483647 + 1;
  return positive;
};

export const tagToColor = (tag: string) => {
  const h = hashStrToNum(tag) + 1;
  const c = colors[h % colors.length]!;
  const variant = [5, 6, 7, 8, 9][h % 5];
  return `${c}.${variant}`;
};
