import { CheckboxProps } from "@mantine/core";
import { IconStar, IconStarFilled } from "@tabler/icons-react";

export const CheckboxStarIcon: CheckboxProps["icon"] = ({
  indeterminate,
  className,
}) =>
  indeterminate ? (
    <IconStar className={className} />
  ) : (
    <IconStarFilled className={className} />
  );
