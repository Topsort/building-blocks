/* global TopsortBlocks */

// Demo config
const imgSize = 160;
const numProducts = 20;
const isUsingTopsortBlocks = true;
const isUsingCustomProps = true;
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

  const productName = `Product ${num}`;
  const productImgUrl = `https://picsum.photos/${imgSize}?random=${num}`;

  const img = product.querySelector(".product-img");
  img.src = productImgUrl;
  img.width = imgSize;
  img.height = imgSize;

  product.querySelector(".product-name").innerText = productName;
  product.querySelector(".product-vendor").innerText = `Vendor ${num}`;
  product.querySelector(".product-price").innerText = `$${num}.99`;

  const target = product.querySelector(".promote-target-placeholder");
  target.classList.remove("promote-target-placeholder");

  // To demo no Promote button for product 7
  if (num !== 7) {
    target.classList.add(
      isUsingCustomProps
        ? customPromoteTargetClassName
        : TopsortBlocks.promoteTargetClassName
    );
    target.dataset.tsProductId = `product-${num}`;
    target.dataset.tsProductName = productName;
    target.dataset.tsProductImgUrl = productImgUrl;
  }

  return product;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.TopsortBlocks) {
    console.log("[TopsortBlocks] Module loaded");
  } else {
    console.error("[TopsortBlocks] Module did not load correctly.");
    return;
  }

  const wrapper = document.querySelector(".wrapper");

  for (let i = 1; i < numProducts + 1; i++) {
    const product = createProductElement(i);
    wrapper.appendChild(product);
  }

  if (!isUsingTopsortBlocks) return;

  const tsBlocks = new TopsortBlocks();
  await tsBlocks.init({
    apiKey: "abc123",
    externalVendorId: "vendor-id",
  });

  if (isUsingCustomProps) {
    tsBlocks.initProductPromotion({
      promoteTargetClassName: customPromoteTargetClassName,
      style: {
        primaryColorRgb: "120, 170, 50",
        fontColorRgb: [200, 80, 215],
        button: {
          borderRadius: "none",
        },
      },
      text: {
        promoteButton: "Create Campaign",
        detailButton: "View Campaign",
      },
    });
  } else {
    tsBlocks.initProductPromotion();
  }
});
