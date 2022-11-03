export function validateVendor(url, apiKey) {
  const request = new XMLHttpRequest();
  request.open("GET", url, false); // false for synchronous request
  request.setRequestHeader("Authorization", `Bearer ${apiKey}`);
  request.send(null);
  return JSON.parse(request.responseText).authToken;
}
