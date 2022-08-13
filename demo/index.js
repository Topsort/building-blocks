/* global TopsortElements */

// Demo config
const imgSize = 160;
const numProducts = 20;
const isUsingTopsortElements = true;
const isUsingCustomProps = true;

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
  const info = product.querySelector(".product-info");
  info.dataset.topsortProductId = `product-${num}`;
  info.classList.add(
    isUsingCustomProps ? "my-custom-promote-target" : "topsort-promote-target"
  );
  product.querySelector(".product-name").innerText = `Product ${num}`;
  product.querySelector(".product-vendor").innerText = `Vendor ${num}`;
  product.querySelector(".product-price").innerText = `$${num}.99`;

  return product;
}

document.querySelector("#topsort-elements").addEventListener("load", () => {
  console.log("TopsortElements loaded:", window.TopsortElements);

  if (!window.TopsortElements) {
    console.error("[Topsort Elements] Module did not load correctly.");
    return;
  }

  const wrapper = document.querySelector(".wrapper");
  for (let i = 1; i < numProducts + 1; i++) {
    const product = createProductElement(i);
    wrapper.appendChild(product);
  }

  if (!isUsingTopsortElements) return;

  TopsortElements.init({
    apiKey: "abc123",
  });

  if (isUsingCustomProps) {
    TopsortElements.initProductPromotion({
      buttonText: "Create Campaign",
      modalTargetClass: "my-custom-modal-target",
      promoteTargetClass: "my-custom-promote-target",
      style: {
        button: {
          className: "my-custom-button",
        },
        buttonText: {
          className: "my-custom-button-text",
          replace: true,
        },
      },
    });
  } else {
    TopsortElements.initProductPromotion();
  }
});
