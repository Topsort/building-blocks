import { h, FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { Svg, SvgProps } from "./Svg";
import { ArrowUp1Linear } from "./icons/ArrowUp1Linear";
import { BackSquare } from "./icons/BackSquare";
import { Bag } from "./icons/Bag";
import { Checkmark } from "./icons/Checkmark";
import { Eye } from "./icons/Eye";
import { InfoCircle } from "./icons/InfoCircle";
import { InfoCircleBold } from "./icons/InfoCircleBold";
import { MessageAdd } from "./icons/MessageAdd";
import { MessageQuestion } from "./icons/MessageQuestion";
import { Money } from "./icons/Money";
import { MouseSquare } from "./icons/MouseSquare";
import { Plus } from "./icons/Plus";

// NOTE(christopherbot) All keys are wrapped in quotes for easier programmatic sorting
// prettier-ignore
/* eslint-disable quote-props */
const icons = {
  "arrow-up-1-linear": ArrowUp1Linear,
  "checkmark": Checkmark,
  "info-circle-bold": InfoCircleBold,
  "info-circle": InfoCircle,
  "message-question": MessageQuestion,
  "plus": Plus,
  "back-square": BackSquare,
  "bag": Bag,
  "eye": Eye,
  "message-add": MessageAdd,
  "money": Money,
  "mouse-square": MouseSquare
};

export type IconName = keyof typeof icons;

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
