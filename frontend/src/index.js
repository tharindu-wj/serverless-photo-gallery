const axios = require("axios");
const FormData = require("form-data");
const { baseUrl } = require("./config");

(async (window, document) => {
  /**
   * Upload photo functionality
   */
  const form = document.querySelector("#photo-upload");
  const submitPhotoUpload = async (event) => {
    event.preventDefault();
    // create a FormData object and append form data to it
    const formData = new FormData(form);

    const cognitoToken = localStorage.getItem("cognitoToken");
    let headers = {
      "Content-Type": "multipart/form-data",
    };
    if (cognitoToken) {
      headers.Authorization = `Bearer ${cognitoToken}`;
    }

    try {
      await axios.post(`${baseUrl}/photo`, formData, {
        headers,
      });
      alert("Photo uploaded successfully");
    } catch (error) {
      console.error(error);
      alert(`Photo upload failed due to ${error.message}`);
    }
  };
  form?.addEventListener("submit", submitPhotoUpload);

  /**
   * Load photos functionality
   */
  const button = document.querySelector("#loadImages");
  const loadPhotos = async (event) => {
    event.preventDefault(); // prevent default form submission behavior
    const cognitoToken = localStorage.getItem("cognitoToken");
    let path = "photos-public";
    let headers = {};
    if (cognitoToken) {
      path = "photos-private";
      headers = {
        Authorization: `Bearer ${cognitoToken}`,
      };
    }

    try {
      const response = await axios.get(`${baseUrl}/${path}`, {
        headers,
      });
      const photos = response.data.data || [];
      const photoContainer = document.querySelector("#photoContainer");
      const html = photos.reduce((previousValue, currentValue) => {
        return (
          previousValue +
          `<div class="col"><div class="card shadow-sm"><img src="${currentValue.url}" class="bd-placeholder-img card-img-top" /></div></div>`
        );
      }, "");
      if (photoContainer) {
        photoContainer.innerHTML = html;
      }
    } catch (error) {
      console.error(error);
    }
  };
  // Load images when click on the load button
  button?.addEventListener("click", loadPhotos);
  // Load images when window loaded
  window.addEventListener("load", loadPhotos);

  /**
   * Set cognito token to local storage
   */
  const setAuthToken = (event) => {
    const cognitoToken = location.href?.split("=")?.[1]?.split("&")?.[0];
    if (cognitoToken) {
      localStorage.setItem("cognitoToken", cognitoToken);
    }
  };
  window.addEventListener("load", setAuthToken);
})(window, document);
