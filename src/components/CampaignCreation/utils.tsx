import { PaymentMethod } from "@api/types";
import { Icon } from "@components/Icon";
import { h, FunctionalComponent } from "preact";

export const PaymentMethodIcon: FunctionalComponent<{
  paymentMethod: PaymentMethod;
}> = ({ paymentMethod }) => {
  switch (paymentMethod.data.brand) {
    case "visa":
      return <Icon name="visa" viewBox="71.75 85 72.75 45.96" />;
    case "mastercard":
      return <Icon name="mastercard" viewBox="0 0 152.407 108" />;
    case "amex":
      return <Icon name="amex" viewBox="5 15 60 39" />;
    case "discover":
      return <Icon name="discover" viewBox="0 0 35 24" />;
    case "diners":
      return <Icon name="diners" viewBox="0 0 35 24" />;
    case "jcb":
      return <Icon name="jcb" viewBox="0 0 35 24" />;
    case "unionpay":
      return <Icon name="union-pay" viewBox="0 0 35 24" />;
    default:
      return <Icon name="credit-card" viewBox="0 0 32 21" />;
  }
};
