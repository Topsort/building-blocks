import { Svg, SvgProps } from "@components/Svg";
import { Plus } from "@components/icons/Plus";
import { h, FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

const icons = {
  plus: Plus,
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
