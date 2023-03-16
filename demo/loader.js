import { topsortedProducts } from "./topsortedProducts.js";
import { validateVendor } from "./validateVendor.js";

/* global TopsortBlocks */

// Demo config
const imgSize = 72;
const numProducts = 20;
const productsPerPage = 10;
const isUsingTopsortBlocks = true;
const isUsingCustomProps = false;
const useTopsortedProducts = true;
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

  const products = useTopsortedProducts
    ? topsortedProducts
    : getNumberedProducts();

  let filter = "";
  let page = 1;

  const pageSelect = document.getElementById("page-select");
  const searchInput = document.getElementById("product-search");

  const updateProductElements = () => {
    document.querySelectorAll(".product").forEach((productElement) => {
      if (productElement.id !== "product-proto") {
        wrapper.removeChild(productElement);
      }
    });

    // filter products by name/id based on the entered filter
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(filter) ||
        product.id.toLowerCase().includes(filter)
    );

    // it indicates the starting index of the products to be displayed
    const offset = (page - 1) * productsPerPage;

    // create product elements
    const productElements = filteredProducts
      .slice(offset, offset + productsPerPage)
      .map((product) => createProductElement(product));
    productElements.forEach((productElement) => {
      wrapper.appendChild(productElement);
    });

    // update the page numbers in select component
    // first remove all page numbers
    // then add new numbers based on the number of products
    pageSelect.querySelectorAll("option").forEach((option) => {
      pageSelect.removeChild(option);
    });

    [
      ...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys(),
    ].forEach((pageIndex) => {
      const option = document.createElement("option");
      option.value = pageIndex + 1;
      option.text = pageIndex + 1;
      pageSelect.appendChild(option);
    });
    pageSelect.value = page;
  };

  updateProductElements();

  searchInput.addEventListener("input", (event) => {
    filter = event.target.value.toLowerCase();
    page = 1;
    updateProductElements();
    if (isUsingTopsortBlocks) {
      tsBlocks.useProductPromotion();
    }
  });

  pageSelect.addEventListener("change", (event) => {
    page = parseInt(event.target.value, 10);
    updateProductElements();
    if (isUsingTopsortBlocks) {
      tsBlocks.useProductPromotion();
    }
  });

  if (!isUsingTopsortBlocks) return;

  const tsBlocks = new TopsortBlocks();
  await tsBlocks.init({
    // This helper calls our demo marketplace backend to retrieve the authToken.
    // You can manually set an auth token here for development purposes.
    authToken: validateVendor(
      "https://demo-marketplace-api.ai",
      "some-api-key"
    ),
    externalVendorId: "vendor-id-123",
    ...(isUsingCustomProps && {
      promoteTargetClassName: customPromoteTargetClassName,
      style: {
        primaryColorRgb: "120, 170, 50",
        secondaryColorRgb: "55, 150, 220",
        fontColorRgb: [200, 80, 215],
        button: {
          borderRadius: "none",
        },
      },
      text: {
        promoteButton: "Create Campaign",
        detailButton: "View Campaign",
      },
    }),
  });

  tsBlocks.useProductPromotion();
});
