export const validateVendor = function httpGet(url, apiKey) {
  var request = new XMLHttpRequest();
  request.open("GET", url, false); // false for synchronous request
  request.setRequestHeader("Authorization", `Bearer ${apiKey}`);
  request.send(null);
  return JSON.parse(request.responseText).authToken;
};
