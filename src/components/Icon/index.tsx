import { h, FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { Svg, SvgProps } from "./Svg";
import { Amex } from "./icons/Amex";
import { ArrowUp1Linear } from "./icons/ArrowUp1Linear";
import { Checkmark } from "./icons/Checkmark";
import { CreditCard } from "./icons/CreditCard";
import { Diners } from "./icons/Diners";
import { Discover } from "./icons/Discover";
import { InfoCircle } from "./icons/InfoCircle";
import { InfoCircleBold } from "./icons/InfoCircleBold";
import { Jcb } from "./icons/Jcb";
import { Mastercard } from "./icons/Mastercard";
import { MessageQuestion } from "./icons/MessageQuestion";
import { Plus } from "./icons/Plus";
import { TickCircle } from "./icons/TickCircle";
import { UnionPay } from "./icons/UnionPay";
import { Visa } from "./icons/Visa";

// NOTE(christopherbot) All keys are wrapped in quotes for easier programmatic sorting
// prettier-ignore
/* eslint-disable quote-props */
const icons = {
  "amex": Amex,
  "arrow-up-1-linear": ArrowUp1Linear,
  "checkmark": Checkmark,
  "credit-card": CreditCard,
  "diners": Diners,
  "discover": Discover,
  "info-circle-bold": InfoCircleBold,
  "info-circle": InfoCircle,
  "jcb": Jcb,
  "mastercard": Mastercard,
  "message-question": MessageQuestion,
  "plus": Plus,
  "tick-circle": TickCircle,
  "union-pay": UnionPay,
  "visa": Visa,
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
