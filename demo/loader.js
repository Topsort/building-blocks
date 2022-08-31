/* global TopsortElements */

// Demo config
const imgSize = 160;
const numProducts = 20;
const isUsingTopsortElements = true;
const isUsingCustomProps = false;
const customPromoteTargetClassName = "my-custom-promote-target";

function getNewElement(selector) {
  const proto = document.querySelector(selector);
  const newNode = proto.cloneNode(true);
  newNode.hidden = false;

  // Remove the id on the new element so that the only place
  // the id exists is on the original node for future cloning.
  newNode.id = "";

  return newNode;
}

function createProductElement(num) {
  const product = getNewElement("#product-proto");

  const img = product.querySelector(".product-img");
  img.src = `https://picsum.photos/${imgSize}?random=${num}`;
  img.width = imgSize;
  img.height = imgSize;

  product.querySelector(".product-name").innerText = `Product ${num}`;
  product.querySelector(".product-vendor").innerText = `Vendor ${num}`;
  product.querySelector(".product-price").innerText = `$${num}.99`;

  const target = product.querySelector(".promote-target-placeholder");
  target.classList.remove("promote-target-placeholder");
  target.classList.add(
    isUsingCustomProps
      ? customPromoteTargetClassName
      : TopsortElements.promoteTargetClassName
  );
  target.dataset.tsProductId = `product-${num}`;

  return product;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.TopsortElements) {
    console.log("[TopsortElements] Module loaded");
  } else {
    console.error("[TopsortElements] Module did not load correctly.");
    return;
  }

  const wrapper = document.querySelector(".wrapper");

  for (let i = 1; i < numProducts + 1; i++) {
    const product = createProductElement(i);
    wrapper.appendChild(product);
  }

  if (!isUsingTopsortElements) return;

  const tsElements = new TopsortElements();
  await tsElements.init({
    apiKey: "abc123",
    externalVendorId: "vendor-id",
  });

  if (isUsingCustomProps) {
    document.documentElement.style.setProperty(
      "--ts-primary-rgb",
      "15, 67, 94"
    );
    document.documentElement.style.setProperty(
      "--ts-secondary-rgb",
      "255, 255, 255"
    );
    tsElements.initProductPromotion({
      promoteTargetClassName: customPromoteTargetClassName,
      style: {
        button: {
          borderRadius: "none",
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
