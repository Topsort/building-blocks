/* eslint-disable no-unused-vars */
// Demo config
const imgSize = 160;
const numProducts = 20;
const isUsingTopsortElements = true;
const isUsingCustomProps = true;
const customPromoteTargetClassName = "my-custom-promote-target";

type CustomClassName = {
  className: string;
  replace?: boolean;
};

type Style = Partial<
  Record<"button" | "buttonText" | "modal", CustomClassName>
>;

type CustomText = Partial<
  Record<
    "button" | "modalTitle" | "modalSubtitle" | "modalCampaignNamePlaceholder",
    string
  >
>;

type InitParams = {
  apiKey: string;
};

type InitProductPromotion = {
  promoteTargetClassName?: string;
  style?: Style;
  text?: CustomText;
};

interface TopsortElementsI {
  initProductPromotion({
    promoteTargetClassName,
    style,
    text,
  }?: InitProductPromotion): void;
}

declare const TopsortElements: {
  new (params: InitParams): TopsortElementsI;
  promoteTargetClassName: string;
};

const a = 1;
export { a };
declare global {
  interface Window {
    TopsortElements: typeof TopsortElements;
  }
}

function getNewElement(selector: string) {
  const proto = document.querySelector(selector);
  if (!proto) {
    console.warn(
      "[getNewElement] Did not find element with selector:",
      selector
    );
    return;
  }
  const newNode = proto.cloneNode(true) as HTMLElement;
  newNode.hidden = false;

  // Remove the id on the new element so that the only place
  // the id exists is on the original node for future cloning.
  newNode.id = "";

  return newNode;
}

function createProductElement(num: number) {
  const product = getNewElement("#product-proto");
  if (!product) return;

  const img = product.querySelector(".product-img") as HTMLImageElement;
  const name = product.querySelector(".product-name") as HTMLElement;
  const vendor = product.querySelector(".product-vendor") as HTMLElement;
  const price = product.querySelector(".product-price") as HTMLElement;
  const target = product.querySelector(
    ".promote-target-placeholder"
  ) as HTMLElement;

  if (!(img && name && vendor && price && target)) return;

  img.src = `https://picsum.photos/${imgSize}?random=${num}`;
  img.width = imgSize;
  img.height = imgSize;

  name.innerText = `Product ${num}`;
  vendor.innerText = `Vendor ${num}`;
  price.innerText = `$${num}.99`;

  target.classList.remove("promote-target-placeholder");
  target.classList.add(
    isUsingCustomProps
      ? customPromoteTargetClassName
      : window.TopsortElements.promoteTargetClassName
  );
  target.dataset.tsProductId = `product-${num}`;

  return product;
}

document.addEventListener("DOMContentLoaded", () => {
  const TopsortElements = window.TopsortElements;
  if (TopsortElements) {
    console.log("[TopsortElements] Module loaded:", TopsortElements);
  } else {
    console.error("[TopsortElements] Module did not load correctly.");
    return;
  }

  const wrapper = document.querySelector(".wrapper");
  if (!wrapper) {
    console.warn("Did not find .wrapper. Is the document loaded?");
    return;
  }

  if (isUsingCustomProps) {
    const customModalTarget = document.createElement("div");
    customModalTarget.classList.add("my-custom-modal-target");
    wrapper.appendChild(customModalTarget);
  }

  for (let i = 1; i < numProducts + 1; i++) {
    const product = createProductElement(i);
    if (product) {
      wrapper.appendChild(product);
    }
  }

  if (!isUsingTopsortElements) return;

  const tsElements = new TopsortElements({
    apiKey: "abc123",
  });

  if (isUsingCustomProps) {
    tsElements.initProductPromotion({
      promoteTargetClassName: customPromoteTargetClassName,
      style: {
        button: {
          className: "my-custom-button",
        },
        buttonText: {
          className: "my-custom-button-text",
          replace: true,
        },
      },
      text: {
        button: "Create Campaign",
      },
    });
  } else {
    tsElements.initProductPromotion();
  }
});
