import { lumaProducts } from "./lumaProducts.js";

/* global TopsortBlocks */

// Demo config
const imgSize = 72;
const numProducts = 20;
const isUsingTopsortBlocks = true;
const isUsingCustomProps = false;
const useLumaProducts = true;
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

function createProductElement(product) {
  const productElement = getNewElement("#product-proto");

  const img = productElement.querySelector(".product-img");
  img.src = product.imgUrl;
  img.width = imgSize;
  img.height = imgSize;

  productElement.querySelector(".product-name").innerText = product.name;
  productElement.querySelector(".product-code").innerText = product.id;
  productElement.querySelector(".product-quantity").innerText =
    product.quantity;
  productElement.querySelector(
    ".product-price"
  ).innerText = `$${product.price}`;
  productElement.querySelector(".product-status").innerText = "Active";

  const target = productElement.querySelector(".promote-target-placeholder");
  target.classList.remove("promote-target-placeholder");

  // return early if we should skip over this product for demo purposes
  if (product.skip) return productElement;

  target.classList.add(
    isUsingCustomProps
      ? customPromoteTargetClassName
      : TopsortBlocks.promoteTargetClassName
  );
  target.dataset.tsProductId = product.id;
  target.dataset.tsProductName = product.name;
  target.dataset.tsProductImgUrl = product.imgUrl;

  return productElement;
}

function getNumberedProducts() {
  const products = [];
  for (let i = 1; i < numProducts + 1; i++) {
    products.push({
      id: `product-${i}`,
      imgUrl: `https://picsum.photos/${imgSize}?random=${i}`,
      name: `Product ${i}`,
      price: `${i}.99`,
      quantity: i,
      // to demo NOT putting a promote button on a certain product
      skip: i === 8,
    });
  }
  return products;
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.TopsortBlocks) {
    console.log("[TopsortBlocks] Module loaded");
  } else {
    console.error("[TopsortBlocks] Module did not load correctly.");
    return;
  }

  const wrapper = document.querySelector(".wrapper");

  const products = useLumaProducts ? lumaProducts : getNumberedProducts();

  const productElements = products.map((product) =>
    createProductElement(product)
  );
  productElements.forEach((productElement) => {
    wrapper.appendChild(productElement);
  });

  const searchInput = document.getElementById("product-search");
  searchInput.addEventListener("input", (event) => {
    productElements.forEach((productElement) => {
      const productName =
        productElement.querySelector(".product-name").innerText;
      if (
        productName.toLowerCase().includes(event.target.value.toLowerCase())
      ) {
        productElement.classList.remove("product-hide");
      } else {
        productElement.classList.add("product-hide");
      }
    });
  });

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
