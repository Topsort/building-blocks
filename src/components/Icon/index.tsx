import { h, FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { Svg, SvgProps } from "./Svg";
import { InfoCircle } from "./icons/InfoCircle";
import { InfoCircleBold } from "./icons/InfoCircleBold";
import { MessageQuestion } from "./icons/MessageQuestion";
import { Plus } from "./icons/Plus";
import { TickCircle } from "./icons/TickCircle";

// NOTE(christopherbot) All keys are wrapped in quotes for easier programmatic sorting
// prettier-ignore
/* eslint-disable quote-props */
const icons = {
  "info-circle-bold": InfoCircleBold,
  "info-circle": InfoCircle,
  "message-question": MessageQuestion,
  "plus": Plus,
  "tick-circle": TickCircle
};

type IconName = keyof typeof icons;

export const Icon: FunctionalComponent<
  SvgProps & {
    name: IconName;
  }
> = ({ name, ...props }) => {
  const IconComponent = useMemo(() => icons[name], [name]);

  if (!IconComponent) return <div />;

  return (
    <Svg {...props}>
      <IconComponent />
    </Svg>
  );
};
