import { h, FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { Svg, SvgProps } from "./Svg";
import { Amex } from "./icons/Amex";
import { ArrowCircleUpBold } from "./icons/ArrowCircleUpBold";
import { ArrowDownBold } from "./icons/ArrowDownBold";
import { ArrowUp1Linear } from "./icons/ArrowUp1Linear";
import { BackSquare } from "./icons/BackSquare";
import { Bag } from "./icons/Bag";
import { Checkmark } from "./icons/Checkmark";
import { CreditCard } from "./icons/CreditCard";
import { Diners } from "./icons/Diners";
import { Discover } from "./icons/Discover";
import { Eye } from "./icons/Eye";
import { InfoCircle } from "./icons/InfoCircle";
import { InfoCircleBold } from "./icons/InfoCircleBold";
import { Jcb } from "./icons/Jcb";
import { Mastercard } from "./icons/Mastercard";
import { MessageAdd } from "./icons/MessageAdd";
import { MessageQuestion } from "./icons/MessageQuestion";
import { Money } from "./icons/Money";
import { MouseSquare } from "./icons/MouseSquare";
import { Plus } from "./icons/Plus";
import { TickCircle } from "./icons/TickCircle";
import { UnionPay } from "./icons/UnionPay";
import { Visa } from "./icons/Visa";

// NOTE(christopherbot) All keys are wrapped in quotes for easier programmatic sorting
// prettier-ignore
/* eslint-disable quote-props */
const icons: Record<string, () => h.JSX.Element> = {
  "amex": Amex,
  "arrow-circle-up-bold": ArrowCircleUpBold,
  "arrow-down-bold": ArrowDownBold,
  "arrow-up-1-linear": ArrowUp1Linear,
  "back-square": BackSquare,
  "bag": Bag,
  "checkmark": Checkmark,
  "credit-card": CreditCard,
  "diners": Diners,
  "discover": Discover,
  "eye": Eye,
  "info-circle-bold": InfoCircleBold,
  "info-circle": InfoCircle,
  "jcb": Jcb,
  "mastercard": Mastercard,
  "message-question": MessageQuestion,
  "message-add": MessageAdd,
  "money": Money,
  "mouse-square": MouseSquare,
  "plus": Plus,
  "tick-circle": TickCircle,
  "union-pay": UnionPay,
  "visa": Visa
};

export type IconName = keyof typeof icons;

export const Icon: FunctionalComponent<
  SvgProps & {
    name: IconName;
  }
> = ({ name, ...props }) => {
  const IconComponent: () => h.JSX.Element = useMemo(() => icons[name], [name]);

  if (!IconComponent) return <div />;

  return (
    <Svg {...props}>
      <IconComponent />
    </Svg>
  );
};
