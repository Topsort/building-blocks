define("loader", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.a = void 0;
    /* eslint-disable no-unused-vars */
    // Demo config
    var imgSize = 160;
    var numProducts = 20;
    var isUsingTopsortElements = true;
    var isUsingCustomProps = true;
    var customPromoteTargetClassName = "my-custom-promote-target";
    var a = 1;
    exports.a = a;
    function getNewElement(selector) {
        var proto = document.querySelector(selector);
        if (!proto) {
            console.warn("[getNewElement] Did not find element with selector:", selector);
            return;
        }
        var newNode = proto.cloneNode(true);
        newNode.hidden = false;
        // Remove the id on the new element so that the only place
        // the id exists is on the original node for future cloning.
        newNode.id = "";
        return newNode;
    }
    function createProductElement(num) {
        var product = getNewElement("#product-proto");
        if (!product)
            return;
        var img = product.querySelector(".product-img");
        var name = product.querySelector(".product-name");
        var vendor = product.querySelector(".product-vendor");
        var price = product.querySelector(".product-price");
        var target = product.querySelector(".promote-target-placeholder");
        if (!(img && name && vendor && price && target))
            return;
        img.src = "https://picsum.photos/".concat(imgSize, "?random=").concat(num);
        img.width = imgSize;
        img.height = imgSize;
        name.innerText = "Product ".concat(num);
        vendor.innerText = "Vendor ".concat(num);
        price.innerText = "$".concat(num, ".99");
        target.classList.remove("promote-target-placeholder");
        target.classList.add(isUsingCustomProps
            ? customPromoteTargetClassName
            : window.TopsortElements.promoteTargetClassName);
        target.dataset.tsProductId = "product-".concat(num);
        return product;
    }
    document.addEventListener("DOMContentLoaded", function () {
        var TopsortElements = window.TopsortElements;
        if (TopsortElements) {
            console.log("[TopsortElements] Module loaded:", TopsortElements);
        }
        else {
            console.error("[TopsortElements] Module did not load correctly.");
            return;
        }
        var wrapper = document.querySelector(".wrapper");
        if (!wrapper) {
            console.warn("Did not find .wrapper. Is the document loaded?");
            return;
        }
        if (isUsingCustomProps) {
            var customModalTarget = document.createElement("div");
            customModalTarget.classList.add("my-custom-modal-target");
            wrapper.appendChild(customModalTarget);
        }
        for (var i = 1; i < numProducts + 1; i++) {
            var product = createProductElement(i);
            if (product) {
                wrapper.appendChild(product);
            }
        }
        if (!isUsingTopsortElements)
            return;
        var tsElements = new TopsortElements({
            apiKey: "abc123"
        });
        if (isUsingCustomProps) {
            tsElements.initProductPromotion({
                promoteTargetClassName: customPromoteTargetClassName,
                style: {
                    button: {
                        className: "my-custom-button"
                    },
                    buttonText: {
                        className: "my-custom-button-text",
                        replace: true
                    }
                },
                text: {
                    button: "Create Campaign"
                }
            });
        }
        else {
            tsElements.initProductPromotion();
        }
    });
});
